import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { ServerEvents } from "@dpg/constants";
import { GameData, PlayerData } from "@dpg/types";

@WebSocketGateway({ namespace: "game" })
export class GameGateway {
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
  @SubscribeMessage(ServerEvents.EnterGame)
  handleInitializeSession(
    @MessageBody() data: PlayerData.EnterGameRequest
  ): PlayerData.EnterGameResponse {
    throw new Error("Method not implemented.");
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
  @SubscribeMessage(ServerEvents.StartGame)
  handleGameRequest(
    @MessageBody() data: PlayerData.StartGameRequest
  ): PlayerData.StartGameResponse {
    throw new Error("Method not implemented.");
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
   * Notice there is no synchronous state update; the server can send
   * a state update at any point but is under no obligation to do so
   * directly after recieving a game action.
   */
  @SubscribeMessage(ServerEvents.GameAction)
  handleAction(@MessageBody() data: GameData.Action): void {
    throw new Error("Method not implemented.");
  }
}
