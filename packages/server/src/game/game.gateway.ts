import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { ServerEvents } from "@dpg/constants";
import { GameData, UserData } from "@dpg/types";

@WebSocketGateway({ namespace: "game" })
export class GameGateway {
  @SubscribeMessage(ServerEvents.InitializeSession)
  handleInitializeSession(
    @MessageBody() data: UserData.SessionRequest
  ): UserData.SessionResponse {
    throw new Error("Method not implemented.");
  }

  @SubscribeMessage(ServerEvents.GameRequest)
  handleGameRequest(@MessageBody() data: UserData.GameRequest): void {
    throw new Error("Method not implemented.");
  }

  @SubscribeMessage(ServerEvents.Action)
  handleAction(@MessageBody() data: GameData.Action): void {
    throw new Error("Method not implemented.");
  }
}
