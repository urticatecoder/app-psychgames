const expect = require('chai').expect;
const Lobby = require('../src/lobby/lobby.js').Lobby;
const Room = require('../src/lobby/room.js').Room;
const Player = require('../src/lobby/player.js').Player;

describe('Test Lobby class functionality', () => {
    it('Lobby class has the correct initial values', (done) => {
        const lobby = new Lobby();
        expect(lobby.rooms.size).to.equal(1);
        expect(lobby.rooms.get(Array.from(lobby.rooms.keys())[0])).to.equal(lobby.currRoom);
        done();
    });
    it('Lobby class can allocate new rooms correctly', (done) => {
        const lobby = new Lobby();
        lobby.allocateNewRoom();
        expect(lobby.rooms.size).to.equal(2);
        expect(lobby.roomToPlayer.has(lobby.currRoom.name.toString())).to.equal(true);
        expect(lobby.roomToPlayer.get(lobby.currRoom.name.toString())).to.deep.equal([]);
        done();
    });
    it('Lobby class holds the correct data after calling findRoomForPlayerToJoin', (done) => {
        const lobby = new Lobby();
        let testID = 'test_id';
        let roomName = lobby.findRoomForPlayerToJoin(testID);
        expect(lobby.playerToRoom.has(testID)).to.equal(true);
        expect(lobby.playerToRoom.get(testID)).to.deep.equal(lobby.currRoom);
        expect(lobby.roomToPlayer.get(lobby.currRoom.name.toString())).to.deep.equal([new Player(testID)]);
        let testID2 = '1234';
        lobby.findRoomForPlayerToJoin(testID2);
        expect(lobby.playerToRoom.has(testID2)).to.equal(true);
        expect(lobby.playerToRoom.get(testID2)).to.deep.equal(lobby.currRoom);
        expect(lobby.roomToPlayer.get(lobby.currRoom.name.toString())).to.deep.equal([new Player(testID), new Player(testID2)]);
        done();
    });
    it('getAllPlayersInRoomWithName & getRoomOfPlayer return the correct result', (done) => {
        const lobby = new Lobby();
        let testIDs = ['123', '456', '789', 'abc'];
        testIDs.forEach((id) => {
            lobby.findRoomForPlayerToJoin(id);
        });
        let expectedPlayers = [];
        testIDs.forEach((id) => {
            expectedPlayers.push(new Player(id));
        });
        let roomMapIterator = lobby.rooms.entries();
        let firstRoomName = roomMapIterator.next().value[0];
        expect(lobby.getAllPlayersInRoom(firstRoomName)).to.deep.equal(expectedPlayers);
        expect(lobby.getRoomOfPlayer('789').name.toString()).to.equal(firstRoomName);
        expect(lobby.getRoomOfPlayer('abc').name.toString()).to.equal(firstRoomName);
        lobby.allocateNewRoom();
        testIDs = ['1', '2', '3'];
        testIDs.forEach((id) => {
            lobby.findRoomForPlayerToJoin(id);
        });
        expectedPlayers = [];
        testIDs.forEach((id) => {
            expectedPlayers.push(new Player(id));
        });
        let secondRoomName = roomMapIterator.next().value[0];
        expect(lobby.getAllPlayersInRoom(secondRoomName)).to.deep.equal(expectedPlayers);
        expect(lobby.getRoomOfPlayer('2').name.toString()).to.equal(secondRoomName);
        expect(lobby.getRoomOfPlayer('abc').name.toString()).to.equal(firstRoomName);
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
    it('recordChoice works correctly', (done) => {
        let testID = 'test_id';
        const player = new Player(testID);
        player.recordChoices(['123', '456']);
        expect(player.choices).to.deep.equal([['123', '456']]);
        player.recordChoices(['123']);
        expect(player.choices).to.deep.equal([['123', '456'], ['123']]);
        done();
    });
    it('getChoiceAtTurn works correctly', (done) => {
        let testID = 'test_id';
        const player = new Player(testID);
        player.recordChoices(['123', '456']);
        player.recordChoices(['123']);
        expect(player.getChoiceAtTurn(1)).to.deep.equal(['123', '456']);
        expect(player.getChoiceAtTurn(2)).to.deep.equal(['123']);
        expect(() => player.getChoiceAtTurn(3)).to.throw(/^Player has not confirmed choice for this turn.$/);
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
    it('Should throw an error when a non-player type is passed into addPlayer', (done) => {
        const room = new Room('room 0');
        expect(() => room.addPlayer('not a player obj')).to.throw(/^Parameter is not an instance of the Player class.$/);
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
    it('hasEveryoneConfirmed works', (done) => {
        const room = new Room('room 0');
        let IDs = ['123', '456', '789', 'abc'];
        IDs.forEach((id) => {
            const player = new Player(id);
            room.addPlayer(player);
        });
        expect(room.hasEveryoneConfirmed()).to.equal(false);
        room.players.forEach((player) => {
            player.recordChoices([]);
        });
        expect(room.hasEveryoneConfirmed()).to.equal(true);
        let player = new Player('xyz');
        room.addPlayer(player);
        expect(room.hasEveryoneConfirmed()).to.equal(false);
        player.recordChoices([]);
        expect(room.hasEveryoneConfirmed()).to.equal(true);
        done();
    });
    it('getEveryoneChoice works', (done) => {
        const room = new Room('room 0');
        let player1 = new Player('123');
        player1.recordChoices(['456', '789']);
        let player2 = new Player('456');
        player2.recordChoices(['123', '789']);
        let player3 = new Player('789');
        player3.recordChoices(['123', '456']);
        room.addPlayer(player1);
        room.addPlayer(player2);
        room.addPlayer(player3);
        let expectedResult = new Map([
            ['123', ['456', '789']],
            ['456', ['123', '789']],
            ['789', ['123', '456']]
        ]);
        expect(room.getEveryoneChoiceAtCurrentTurn()).to.deep.equal(expectedResult);
        done();
    });
    it('getPlayerWithID works correctly', (done) => {
        const room = new Room('room 0');
        let player1 = new Player('123');
        let player2 = new Player('456');
        let player3 = new Player('789');
        room.addPlayer(player1);
        room.addPlayer(player2);
        room.addPlayer(player3);
        expect(room.getPlayerWithID('123')).to.equal(player1);
        done();
    });
    it('turn timer setter and getter works', (done) => {
        const room = new Room('room 0');
        let player1 = new Player('123');
        let player2 = new Player('456');
        let player3 = new Player('789');
        room.addPlayer(player1);
        room.addPlayer(player2);
        room.addPlayer(player3);
        expect(room.turnNum).to.equal(1);
        room.advanceToNextTurn();
        expect(room.turnNum).to.equal(2);
        done();
    });
});

