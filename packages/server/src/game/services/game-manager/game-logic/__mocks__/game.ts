import { GameModel } from "@dpg/types";
import { DefaultGameConstants } from "../../constants.js";
import { AGame } from "../game";

const gameState = {
  prop: "value",
};

const testPlayerMap = new Map([
  [
    "1",
    {
      id: "1",
      avatar: 0,
    },
  ],
  [
    "2",
    {
      id: "2",
      avatar: 0,
    },
  ],
  [
    "3",
    {
      id: "3",
      avatar: 0,
    },
  ],
  [
    "4",
    {
      id: "4",
      avatar: 0,
    },
  ],
  [
    "5",
    {
      id: "5",
      avatar: 0,
    },
  ],
  [
    "6",
    {
      id: "6",
      avatar: 0,
    },
  ],
]);

/**
 * There is currently a self-dependence issue when trying to
 * selectively change class properties on *user* modules.
 * This method can be seen in the socket.io mock, but in a
 * user module you cannot call the constructor of
 * createMockImplementationFromModule.
 *
 * TODO: Debug jest and fix this issue
 */

const GameInstance: AGame = {
  constants: DefaultGameConstants,
  players: [...testPlayerMap.values()],
  playerMap: testPlayerMap,
  state: <GameModel.State>(<unknown>gameState),
  isJoinable: jest.fn().mockReturnValue(true),
  submitAction: jest.fn(),
  goToNextGame: jest.fn(),
  emitState: jest.fn(),
};

export function Game() {
  return GameInstance;
}
