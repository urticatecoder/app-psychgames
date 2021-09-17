import { ServerEvents } from "@dpg/constants";
import { GameModel, PlayerModel } from "@dpg/types";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameManagerService } from "./../../services/game-manager/game-manager.service";

@WebSocketGateway({ namespace: "game" })
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
  handleInitializeSession(
    @MessageBody() data: PlayerModel.EnterGameRequest,
    @ConnectedSocket() socket: Socket
  ): PlayerModel.EnterGameResponse {
    if (!data.id) {
      return {
        inGame: false,
      };
    }

    const ableToInitialize = this.gameManager.attachToPlayer(
      socket.id,
      data.id
    );

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
  handleGameRequest(
    @MessageBody() data: PlayerModel.StartGameRequest,
    @ConnectedSocket() socket: Socket
  ): PlayerModel.StartGameResponse {
    const id = this.gameManager.attachToGame(socket.id, data.playerMetadata);

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
  handleAction(
    @MessageBody() data: GameModel.Action,
    @ConnectedSocket() socket: Socket
  ): void {
    this.gameManager.submitAction(socket.id, data);
  }
}
