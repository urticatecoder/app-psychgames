const expect = require('chai').expect;
const Lobby = require('../lobby.js').Lobby;
const Room = require('../lobby.js').Room;
const Player = require('../lobby.js').Player;

describe('Test Lobby class functionality', () => {
    it('Lobby class has the correct initial values', (done) => {
        const lobby = new Lobby();
        expect(lobby.currRoomID).to.equal(1);
        expect(lobby.currRoom.name).to.equal('room 1');
        expect(lobby.rooms[0]).to.equal(lobby.currRoom);
        expect(lobby.rooms.length).to.equal(1);
        done();
    });
    it('Lobby class can allocate new rooms correctly', (done) => {
        const lobby = new Lobby();
        lobby.allocateNewRoom();
        expect(lobby.currRoomID).to.equal(2);
        expect(lobby.currRoom.name).to.equal('room 2');
        expect(lobby.roomToPlayer.has(lobby.currRoom.name)).to.equal(true);
        expect(lobby.roomToPlayer.get(lobby.currRoom.name)).to.deep.equal([]);
        done();
    });
    it('Lobby class holds the correct data after calling findRoomForPlayerToJoin', (done) => {
        const lobby = new Lobby();
        let testID = 'test_id';
        let roomName = lobby.findRoomForPlayerToJoin(testID);
        expect(roomName).to.equal('room 1');
        expect(lobby.playerToRoom.has(testID)).to.equal(true);
        expect(lobby.playerToRoom.get(testID)).to.deep.equal(lobby.currRoom);
        expect(lobby.roomToPlayer.get(lobby.currRoom.name)).to.deep.equal([new Player(testID)]);
        let testID2 = '1234';
        lobby.findRoomForPlayerToJoin(testID2);
        expect(roomName).to.equal('room 1');
        expect(lobby.playerToRoom.has(testID2)).to.equal(true);
        expect(lobby.playerToRoom.get(testID2)).to.deep.equal(lobby.currRoom);
        expect(lobby.roomToPlayer.get(lobby.currRoom.name)).to.deep.equal([new Player(testID), new Player(testID2)]);
        done();
    });
    it('getAllPlayersInRoomWithName & getRoomPlayerIsIn return the correct result', (done) => {
        const lobby = new Lobby();
        let testIDs = ['123', '456', '789', 'abc'];
        testIDs.forEach((id) => {
            lobby.findRoomForPlayerToJoin(id);
        });
        let expectedPlayers = [];
        testIDs.forEach((id) => {
           expectedPlayers.push(new Player(id));
        });
        expect(lobby.getAllPlayersInRoomWithName('room 1')).to.deep.equal(expectedPlayers);
        expect(lobby.getRoomPlayerIsIn('789').name).to.equal('room 1');
        expect(lobby.getRoomPlayerIsIn('abc').name).to.equal('room 1');
        lobby.allocateNewRoom();
        testIDs = ['1', '2', '3'];
        testIDs.forEach((id) => {
            lobby.findRoomForPlayerToJoin(id);
        });
        expectedPlayers = [];
        testIDs.forEach((id) => {
            expectedPlayers.push(new Player(id));
        });
        expect(lobby.getAllPlayersInRoomWithName('room 2')).to.deep.equal(expectedPlayers);
        expect(lobby.getRoomPlayerIsIn('2').name).to.equal('room 2');
        expect(lobby.getRoomPlayerIsIn('abc').name).to.equal('room 1');
        done();
    });
});

describe('Test Room class functionality', () => {
    it('Room class has the correct initial values', (done) => {
        const room = new Room('room 0');
        expect(room.players.length).to.equal(0);
        expect(room.turnNum).to.equal(1);
        done();
    });
    it('Should throw an error when no room name is passed into the constructor', (done) => {
        expect(() => new Room()).to.throw(/^Room name not defined$/);
        done();
    });
    it('canFindPlayerWithID works', (done) => {
        const room = new Room('room 0');
        room.addPlayer(new Player('123'));
        room.addPlayer(new Player('456'));
        room.addPlayer(new Player('789'));
        expect(room.canFindPlayerWithID('123')).to.equal(true);
        expect(room.canFindPlayerWithID('456')).to.equal(true);
        expect(room.canFindPlayerWithID('789')).to.equal(true);
        expect(room.canFindPlayerWithID('111')).to.equal(false);
        done();
    });
});

describe('Test Player class functionality', () => {
    it('Player class has the correct initial values', (done) => {
        let testID = 'test_id';
        const player = new Player(testID);
        expect(player.prolificID).to.equal(testID);
        expect(player.isBot).to.equal(false);
        done();
    });
    it('Should throw an error when no prolificID is passed into the constructor', (done) => {
        expect(() => new Player()).to.throw(/^prolificID not defined$/);
        done();
    });
    it('Should throw an error when a non-boolean value is passed into setIsBot', (done) => {
        const player = new Player('test_id');
        expect(() => player.setIsBot('not a boolean')).to.throw(/^Parameter is not a Boolean type.$/);
        done();
    });
});

