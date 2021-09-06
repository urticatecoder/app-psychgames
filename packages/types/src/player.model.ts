export namespace PlayerData {
  /**
   * A v4 RFC4122 UUID; don't confuse this with user entered
   * data like prolific/lobby keys
   *
   * ex: 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed
   */
  export type ID = string;

  /**
   * A request to enter an existing game with an ID
   */
  export type EnterGameRequest = {
    id?: string;
  };

  /**
   * The enter response; if not in game, the client must negotiate
   * entry into a new game. If the ID is in game, the client will
   * recieve a state update message; make sure you have your subscription
   * set up *before* you request game entry.
   */
  export type EnterGameResponse = {
    inGame: boolean;
  };

  /**
   * Request entry into a game, optionally with metadata like prolific/lobby ids
   * The server will matchmake appropriately and then send a state update message
   *
   * If the game request is accepted, the client will recieve a state update message;
   * make sure you have your subscriptionset up *before* you initiate a session
   */
  export type StartGameRequest = {
    playerMetadata?: PlayerMetadata;
  };

  /**
   * A new ID assigned for the requested game.
   */
  export type StartGameResponse = {
    id: string;
  };

  export type PlayerMetadata = {
    prolificId?: string;
    lobbyId?: string;
  };
}
