import { LobbyModel } from "@dpg/types";
import { Socket } from "socket.io";
import { GameInstance } from "./game";

export class Lobby implements GameInstance {
  constructor(private goToNextGame: () => void, private room: Socket) {}

  submitAction(playerID: string, action: LobbyModel.PlayerData): void {
    throw new Error("Method not implemented.");
  }

  getState(): LobbyModel.State {
    throw new Error("Method not implemented.");
  }
}
