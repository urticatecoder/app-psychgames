export namespace UserData {
  /**
   * A v4 RFC4122 UUID; don't confuse this with user entered
   * data like prolific/lobby keys
   *
   * ex: 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed
   */
  export type ID = string;

  /**
   * The session data sent to the server upon initial negotiation
   */
  export type SessionRequest = {
    id?: string;
  };

  /**
   * The session response; if not in game, the client must negotiate
   * entry into a new game. If the session is in game, the client will
   * recieve a state update message; make sure you have your subscription
   * set up *before* you initiate a session
   */
  export type SessionResponse = {
    id: string;
    inGame: boolean;
  };

  /**
   * Request entry into a game, optionally with metadata like prolific/lobby ids
   * The server will matchmake appropriately and then send a state update message
   */
  export type GameRequest = {
    playerMetadata?: PlayerMetadata;
  };

  export type PlayerMetadata = {
    prolificId?: string;
    lobbyId?: string;
  };
}
