const expect = require('chai').expect;
const clientIO = require('socket.io-client');
const serverIO = require('socket.io').listen(3001);
const lobby = require('../lobby.js').LobbyInstance;
const Lobby = require('../lobby.js').Lobby;

describe('Socket connection', function () {
    let socketURL = 'http://localhost:3001';

    function createClients(num) {
        return Array(num).fill(null).map(() => clientIO(socketURL));
    }

    function registerCallback(clients, eventName, callback) {
        clients.forEach(client => client.on(eventName, callback));
    }

    function emitEnterLobbyEvents(clients, prolificIDs) {
        clients.forEach((client, i) => {
            client.emit('enter lobby', prolificIDs[i]);
        });
    }

    function closeClientConnections(clients) {
        clients.forEach((client) => {
            client.close();
        });
    }

    beforeEach(function (done) {
        serverIO.sockets.on('connection', function (socket) {
            require('../lobby.js').LobbySocketListener(serverIO, socket);
        });
        done();
    });

    it('enter lobby, room fill, join emitted correctly for one room', function (done) {
        let clients = createClients(6);
        let IDs = ['123', '456', '789', 'abc', 'def', '000'];
        let timesCalled = 0;
        registerCallback(clients, 'room fill', (res) => {
            timesCalled++;
            // console.log(res);
            expect(res).to.have.members(IDs);
        });
        registerCallback(clients, 'join', (msg) => {
            // console.log(msg);
           expect(msg).to.match(/.+ has joined room 1/);
        });
        registerCallback(clients, 'num of people in the room', (num) => {
            // console.log(num);
            expect(num).to.lessThan(7);
        });
        emitEnterLobbyEvents(clients, IDs);
        setTimeout(() => {
            expect(lobby.playerToRoom.has('123')).to.equal(true);
            expect(lobby.playerToRoom.has('000')).to.equal(true);
            expect(timesCalled).to.equal(6);
            closeClientConnections(clients);
            done();
        }, 250);
    });

    it('enter lobby, room fill, join emitted correctly for two rooms', function (done) {
        let clients = createClients(6);
        emitEnterLobbyEvents(clients, ['123', '456', '789', 'abc', 'def', '000']);
        registerCallback(clients, 'room fill', (msg) => {
            expect(msg).to.equal('room 1 is filled up.');
        });
        registerCallback(clients, 'join', (msg) => {
            expect(msg).to.match(/.+ has joined room 1/);
        });
        let clientsInSecondRoom = createClients(6);
        emitEnterLobbyEvents(clientsInSecondRoom, ['1234', '4567', '7891', '1111', '2222', '0000']);
        registerCallback(clientsInSecondRoom, 'room fill', (msg) => {
            expect(msg).to.equal('room 2 is filled up.');
        });
        registerCallback(clientsInSecondRoom, 'join', (msg) => {
            expect(msg).to.match(/.+ has joined room 2/);
        });
        setTimeout(() => {
            expect(lobby.playerToRoom.has('123')).to.equal(true);
            expect(lobby.playerToRoom.has('000')).to.equal(true);
            // expect(timesCalled).to.equal(6);
            closeClientConnections(clients);
            closeClientConnections(clientsInSecondRoom);
            done();
        }, 250);
    });

    afterEach(function (done) {
        serverIO.close();
        done();
    });
});
