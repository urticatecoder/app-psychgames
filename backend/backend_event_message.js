const BackendEventMessage = {
  PLAYER_TIME: 'player time',
  PLAYER_JOIN_ROOM: 'join',
  PLAYER_LEAVE_ROOM: 'left',
  NUM_PLAYER_IN_ROOM: 'num of people in the room',
  ROOM_FILL: 'room fill',
  CHECK_PASSIVITY: 'check passivity',
  GAME_ONE_ROUND_RESULT: 'location for game 1',
  END_GAME_TWO_ROUND: 'end current turn for game 2',
  END_GAME_ONE: 'end game 1',
  END_GAME_TWO: 'end game 2',
  SEND_FINAL_RESULTS: 'send results',
}

module.exports = { BackendEventMessage };