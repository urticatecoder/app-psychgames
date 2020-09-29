const assert = require('assert');
const Lobby = require('../lobby.js').Lobby;

describe('Test lobby class functionality', () => {
    it('lobby class has the correct initial values', (done) => {
        const lobby = new Lobby();
        assert(lobby.nextRoomID === 0);
        assert(lobby.currRoom.name === 'room 0');
        assert(lobby.rooms[0] === lobby.currRoom);
        assert(lobby.rooms.length === 1);
        done();
    });
    it('lobby class can allocate new rooms correctly', (done) => {
        const lobby = new Lobby();
        assert(lobby.availableRoomNameToJoin === 'room 0');
        lobby.allocateNewRoom();
        assert(lobby.availableRoomNameToJoin === 'room 1');
        done();
    });
})
