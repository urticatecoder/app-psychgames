const expect = require('chai').expect;
const Room = require('../room.js').Room;
const Player = require('../player.js').Player;
const GAME_TWO_MAX_TURN_NUM = require('../games_config.js').GAME_TWO_MAX_TURN_NUM;
const Game2 = require('../game2.js');
const Allocation = require('../allocation.js').Allocation;

describe('Test game 2 backend logic', () => {
    it('generateCompeteAndInvestPayoff works correctly', (done) => {
        let payoff = Game2.generateCompeteAndInvestPayoff();
        expect(payoff.length).to.equal(GAME_TWO_MAX_TURN_NUM);
        done();
    });
    it('advanceToGameTwo sets the correct values for instance variables', (done) => {
        let room = new Room('room 1');
        room.advanceToGameTwo();
        expect(room.turnNum).to.equal(1);
        expect(room.gameTwoPayoff.length).to.equal(GAME_TWO_MAX_TURN_NUM);
        done();
    });
    it('getCompeteAndInvestPayoffAtTurnNum works', (done) => {
        let room = new Room('room 1');
        room.advanceToGameTwo();
        expect(room.getCompeteAndInvestPayoffAtTurnNum(1).length).to.equal(2);
        done();
    });
    it('generateBotAllocation works', (done) => {
        let allocation = Game2.generateBotAllocation();
        let sum = 0;
        allocation.forEach((n) => sum += n);
        expect(sum).to.equal(10);
        done();
    });
    it('isGameTwoDone works', (done) => {
        let room = new Room('room 1');
        room.advanceToGameTwo();
        for (let i = 1; i < GAME_TWO_MAX_TURN_NUM - 1; i++) {
            room.advanceToNextTurn();
        }
        expect(Game2.isGameTwoDone(room)).to.equal(false);
        room.advanceToNextTurn();
        expect(Game2.isGameTwoDone(room)).to.equal(true);
        done();
    });
    it('recordAllocation/getAllocation works', (done) => {
        let room = new Room('room 1');
        room.addPlayer(new Player('123'));
        room.advanceToGameTwo();
        let player1 = room.getPlayerWithID('123');
        player1.recordAllocation(3, 4, 3);
        let expectedAllocation = new Allocation(3, 4, 3);
        expect(room.getPlayerAllocationAtTurnNum('123', 1)).to.deep.equal(expectedAllocation);
        player1.recordAllocation(1, 2, 7);
        expectedAllocation = new Allocation(1, 2, 7);
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
        room.setGameOneResults(['123', '456', '789'], ['aaa', 'bbb', 'ccc']);
        ids.forEach((id) => {
            room.getPlayerWithID(id).recordAllocation(3, 4, 3);
        });
        let group = room.getOthersAllocationAtTurnNum('123', 1);
        expect(group[0].length).to.equal(2);
        expect(group[1].length).to.equal(3);
        done();
    });
    it('getTeamAllocation works', (done) => {
        let room = new Room('room 1');
        let ids = ['123', '456', '789', 'aaa', 'bbb', 'ccc'];
        ids.forEach((id) => {
            room.addPlayer(new Player(id));
        });
        room.advanceToGameTwo();
        room.setGameOneResults(['123', '456', '789'], ['aaa', 'bbb', 'ccc']);
        ids.forEach((id) => {
            room.getPlayerWithID(id).recordAllocation(3, 4, 3);
        });
        let result = room.getTeamAllocationAtCurrentTurn();
        expect(result[0].allocationAsArray).to.deep.equal([9, 12, 9]);
        expect(result[1].allocationAsArray).to.deep.equal([9, 12, 9]);
        done();
    });
});
