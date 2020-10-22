const assert = require('assert');
const BOT = require('../db/bot.js');
const mongoose = require('mongoose');
const { saveNewPlayerToDB } = require('../db/db_api.js');
const Room = require('../lobby.js').Room;
const Player = require('../lobby.js').Player;
const { getResultsByProlificId, isGameOneDone } = require('../db/results.js');
const DB_API = require('../db/db_api.js');


describe('Location sending and calculation', () => {
    it('calculates results and location correctly', (done) => {
        var testID = ['test_id1', 'test_id'];
        var choices = ['test_id'];
        var choices_other = ['test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id'));
        room.addPlayer(new Player('test_id1'));
        room.getPlayerWithID('test_id').recordChoices(choices_other);
        room.getPlayerWithID('test_id1').recordChoices(choices);
        console.log(room);
        let results = getResultsByProlificId(testID, room)
        console.log(results);
        for(var i = 0; i < results.length; i++ ){
            assert(results[i] === 30);
        }
        done();
    });
    // it('calculates triple bonus correctly', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id2', 'test_id3'];
    //     var choicesTwo = ['test_id1', 'test_id3'];
    //     var choicesThree = ['test_id1', 'test_id2'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     const count = getResultsByProlificId(testID, room);
    //     console.log(count);
    //     for(var i =0; i <count.length; i++){
    //         assert(count[i] === 7);
    //     }
    //     done();
    // });

    it('calculates random values correct for multiple rounds', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2'];
        var choicesTwo = ['test_id1'];
        var choicesThree = ['test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        const count = getResultsByProlificId(testID, room);
        console.log(count);
        assert(count[0] == 30 && count[1] == 30);
        assert(count[2] == 0);

        const newRoundCount = getResultsByProlificId(testID, room);
        console.log(newRoundCount);
        assert(newRoundCount[0] == 60 && newRoundCount[1] == 60);
        assert(newRoundCount[2] == 0);
        done();
    });
    // it('isGameOneDone works correctly', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id2', 'test_id3'];
    //     var choicesTwo = ['test_id1', 'test_id3'];
    //     var choicesThree = ['test_id1', 'test_id2'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     for(var i = 0; i< 14; i++){
    //         getResultsByProlificId(testID, room);
    //         assert(isGameOneDone(room) == false);
    //     }
    //     getResultsByProlificId(testID, room);
    //     assert(isGameOneDone(room) == true);
    //     done();
    // });



})
