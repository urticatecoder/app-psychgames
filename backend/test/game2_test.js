const expect = require('chai').expect;
const Lobby = require('../lobby.js').Lobby;
const Room = require('../lobby.js').Room;
const Player = require('../lobby.js').Player;
const Game2 = require('../game2.js');

describe('Test game 2 backend logic', () => {
    it('generateCompeteAndInvestPayoff works correctly', (done) => {
        let payoff = Game2.generateCompeteAndInvestPayoff();
        expect(payoff.length).to.equal(25);
        done();
    });
    it('advanceToGameTwo sets the correct values for instance variables', (done) => {
        let room = new Room('room 1');
        room.advanceToGameTwo();
        expect(room.turnNum).to.equal(0);
        expect(room.gameTwoPayoff.length).to.equal(25);
        done();
    });
    it('getCompeteAndInvestPayoffAtTurnNum works', (done) => {
        let room = new Room('room 1');
        room.advanceToGameTwo();
        expect(room.getCompeteAndInvestPayoffAtTurnNum(1).length).to.equal(2);
        done();
    });
    it('recordAllocation/getAllocation works', (done) => {
        let room = new Room('room 1');
        room.addPlayer(new Player('123'));
        room.advanceToGameTwo();
        let player1 = room.getPlayerWithID('123');
        player1.recordAllocationForGameTwo(3, 4, 3);
        let expectedAllocation = new Game2.GameTwoAllocation(3, 4, 3);
        expect(room.getPlayerAllocationAtTurnNum('123', 1)).to.deep.equal(expectedAllocation);
        player1.recordAllocationForGameTwo(1, 2, 7);
        expectedAllocation = new Game2.GameTwoAllocation(1, 2, 7);
        expect(room.getPlayerAllocationAtTurnNum('123', 2)).to.deep.equal(expectedAllocation);
        done();
    });
    it('getOthersAllocation/calculatePayment works', (done) => {
        let room = new Room('room 1');
        let ids = ['123', '456', '789', 'aaa', 'bbb', 'ccc'];
        ids.forEach((id) => {
            room.addPlayer(new Player(id));
        });
        room.advanceToGameTwo();
        room.setGameOneResults([['123', '456', '789'], ['aaa', 'bbb', 'ccc']]);
        ids.forEach((id) => {
            room.getPlayerWithID(id).recordAllocationForGameTwo(3, 4, 3);
        });
        let group = room.getOthersAllocationAtTurnNum('123', 1);
        expect(group[0].length).to.equal(2);
        expect(group[1].length).to.equal(3);
        console.log(Game2.calculatePaymentForAPlayerAtTurn('123', room, 1));
        done();
    });
});
