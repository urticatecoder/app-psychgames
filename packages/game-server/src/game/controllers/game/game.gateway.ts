import { ServerEvents } from "@dpg/constants";
import {
  EnterGameRequest,
  GameModel,
  PlayerModel,
  requestTypes,
  StartGameRequest,
} from "@dpg/types";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from "@nestjs/websockets";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Server, Socket } from "socket.io";
import { GameManagerService } from "./../../services/game-manager/game-manager.service.js";

function createValidationPipe() {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}
@WebSocketGateway({
  allowEIO3: true, // needed for compatibility between socket.io and socket.io-client
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
})
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(private gameManager: GameManagerService) {}

  afterInit(server: Server) {
    this.gameManager.setServer(server);
  }

  handleDisconnect(socket: Socket) {
    this.gameManager.discardSocket(socket.id);
  }

  /**
   * Entering a game follows the following transaction:
   *
   *        ID/null
   * Client ------> Server(EnterGame)
   *
   * If this ID is involved in an ongoing game:
   *                     inGame: true
   * Client              <----------- Server
   *                     game state
   * Client(StateUpdate) <----------- Server
   *
   * If it is not:
   *        inGame: false
   * Client <------------ Server
   *
   * The client must then request to be placed in a new game to
   * obtain a new ID. This is the chance for the client to
   * ask for user metadata like lobby/prolific IDs.
   *
   * The client may skip this check if they know they don't have
   * a valid ID.
   */
  @SubscribeMessage(ServerEvents.ENTER_GAME)
  @UsePipes(createValidationPipe())
  handleInitializeSession(
    @MessageBody() data: EnterGameRequest,
    @ConnectedSocket() socket: Socket
  ): PlayerModel.EnterGameResponse {
    console.debug("Received enter game request");
    console.debug("  socket id: ", socket.id);
    if (!data.id) {
      console.debug("  no id sent");
      console.debug("  not currently in game");
      return {
        inGame: false,
      };
    }

    console.debug("  id sent");
    const ableToInitialize = this.gameManager.attachPlayer(socket.id, data.id);
    console.debug(ableToInitialize ? "  in game; initializing" : "  not currently in game");

    return {
      inGame: ableToInitialize,
    };
  }

  /**
   * Starting a game follows the following transaction:
   *
   *        PlayerMetadata
   * Client -------------> Server(StartGame)
   *
   * If the metadata is valid:
   *                     id: <new ID>
   * Client              <----------- Server
   *                     game state
   * Client(StateUpdate) <----------- Server
   *
   * If the metadata is not valid:
   *        <error object>
   * Client <------------- Server
   *
   * Note that `null` or `undefined` may be valid values for
   * player metadata. For prolific IDs/lobby IDs, there is only an
   * error if the ID is unknown or already in use.
   *
   * TODO: define error interface so client can give descriptive errors
   */
  @SubscribeMessage(ServerEvents.START_GAME)
  @UsePipes(createValidationPipe())
  handleGameRequest(
    @MessageBody() data: StartGameRequest,
    @ConnectedSocket() socket: Socket
  ): PlayerModel.StartGameResponse {
    console.debug("Received start game request");
    console.debug("  socket id: ", socket.id);
    const id = this.gameManager.attachSocket(socket.id, data.playerMetadata);

    return { id };
  }

  /**
   * Submitting a game action follows the following transaction:
   *
   *        Action
   * Client -----> Server(GameAction)
   *
   * If the action is valid:
   *        <acknowledgement>
   * Client <---------------- Server
   *
   * If the action is invalid:
   *        <error object>
   * Client <------------- Server
   *
   * Notice there is no synchronous state update; the server can send
   * a state update at any point but is under no obligation to do so
   * directly after recieving a game action.
   */
  @SubscribeMessage(ServerEvents.GAME_ACTION)
  async handleAction(
    @MessageBody() data: { [key: string]: unknown },
    @ConnectedSocket() socket: Socket
  ) {
    /**
     * class-transformer and class-validator don't have proper top-level polymorphism,
     * so we need to determine the correct class and validate it manually.
     */
    const type = typeof data["type"] === "string" ? data["type"] : undefined;
    console.debug(`Recieved game action of type ${type} from socket ${socket.id}`);
    console.debug(data);

    const requestClass = type ? requestTypes[type] : undefined;
    if (!requestClass) {
      throw new WsException(`invalid request type; ${type} was not recognized`);
    }

    const requestInstance = <{ [key: string]: unknown } | undefined>(
      plainToClass(requestClass, data)
    );
    if (!requestInstance) {
      console.warn("failed to interpret action");
      throw new WsException(
        "the data could not be interpreted; please check your schema"
      );
    }

    try {
      await validate(requestInstance);
      const validatedData = <GameModel.Action>(<unknown>requestInstance);
      this.gameManager.submitAction(socket.id, validatedData);
    } catch (errors) {
      if (errors instanceof ValidationError) {
        console.warn(errors.toString(true));
        throw new WsException(errors.toString(false));
      } else {
        throw new WsException("an unknown error occurred");
      }
    }
  }
}
