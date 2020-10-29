const assert = require('assert');
const BOT = require('../db/bot.js');
const mongoose = require('mongoose');
const { saveNewPlayerToDB } = require('../db/db_api.js');
const Room = require('../lobby.js').Room;
const Player = require('../lobby.js').Player;
const { getResultsByProlificId, calculateAllDoubleBonuses, calculateAllTripleBonuses,
calculateResults, getResults } = require('../db/results.js');
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
            assert(results[i] === 8);
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
        assert(count[0] == 8 && count[1] == 12);
        assert(count[2] == 0);

        const newRoundCount = getResultsByProlificId(testID, room);
        console.log(newRoundCount);
        assert(newRoundCount[0] == 16 && newRoundCount[1] == 24);
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
    it('calculates triple bonus', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id1', 'test_id3'];
        var choicesThree = ['test_id2', 'test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let tripleBonuses = calculateAllTripleBonuses(testID, room);
        assert(tripleBonuses[0][0] == 'test_id1');
        assert(tripleBonuses[0][1] == 'test_id2');
        assert(tripleBonuses[0][2] == 'test_id3');
        done();
    });
    it('calculates triple bonus with 2 triple bonuses', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3', 'test_id4', 'test_id5', 'test_id6'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id1', 'test_id3'];
        var choicesThree = ['test_id2', 'test_id1'];
        var choicesFour = ['test_id5', 'test_id6'];
        var choicesFive = ['test_id6', 'test_id4'];
        var choicesSix = ['test_id5', 'test_id4'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.addPlayer(new Player('test_id4'));
        room.addPlayer(new Player('test_id5'));
        room.addPlayer(new Player('test_id6'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        room.getPlayerWithID('test_id4').recordChoices(choicesFour);
        room.getPlayerWithID('test_id5').recordChoices(choicesFive);
        room.getPlayerWithID('test_id6').recordChoices(choicesSix);

        let tripleBonuses = calculateAllTripleBonuses(testID, room);
        assert(tripleBonuses[0][0] == 'test_id1');
        assert(tripleBonuses[0][1] == 'test_id2');
        assert(tripleBonuses[0][2] == 'test_id3');
        assert(tripleBonuses[1][0] == 'test_id4');
        assert(tripleBonuses[1][1] == 'test_id5');
        assert(tripleBonuses[1][2] == 'test_id6');
        done();
    });
    it('calculates double bonus', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id3'];
        var choicesTwo = ['test_id3'];
        var choicesThree = ['test_id2', 'test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let doubleBonuses = calculateAllDoubleBonuses(testID, room);
        assert (doubleBonuses.length == 2);
        done();
    });

    it('calculates single bonus', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id3'];
        var choicesTwo = ['test_id3'];
        var choicesThree = ['test_id2', 'test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let singleMap = calculateResults(testID, room);
        assert(singleMap.get('test_id1') == 0);
        assert(singleMap.get('test_id2') == 0);
        assert(singleMap.get('test_id3') == 0);
        done();
    });
    it('calculates location correctly for no single bonuses', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id3'];
        var choicesTwo = ['test_id3'];
        var choicesThree = ['test_id2', 'test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let resultsOne = getResults('test_id1',testID, room);
        let resultsTwo = getResults('test_id2',testID, room);
        let resultsThree = getResults('test_id3',testID, room);
        assert(resultsOne == 8);
        assert(resultsTwo == 8);
        assert(resultsThree == 16);
        done();
    });
    it('calculates location correctly for single bonuses', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2'];
        var choicesTwo = ['test_id3'];
        var choicesThree = ['test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let resultsOne = getResults('test_id1',testID, room);
        let resultsTwo = getResults('test_id2',testID, room);
        let resultsThree = getResults('test_id3',testID, room);
        assert(resultsOne == 4);
        assert(resultsTwo == 4);
        assert(resultsThree == 4);
        done();
    });
    it('calculates location correctly for single and double bonuses', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id1'];
        var choicesThree = ['test_id1', 'test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let resultsOne = getResults('test_id1',testID, room);
        let resultsTwo = getResults('test_id2',testID, room);
        let resultsThree = getResults('test_id3',testID, room);
        assert(resultsOne == 16);
        assert(resultsTwo == 12);
        assert(resultsThree == 8);
        done();
    });
    it('gets empty triple and double bonus', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id3'];
        var choicesTwo = ['test_id1'];
        var choicesThree = ['test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let triple = calculateAllTripleBonuses(testID, room);
        let double = calculateAllDoubleBonuses(testID, room);
        assert(triple.length == 0);
        assert(double.length == 0);
        done();
    });
    it('gets all locations correctly', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id3'];
        var choicesTwo = ['test_id1'];
        var choicesThree = ['test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);

        let results = getResultsByProlificId(testID, room);
        assert(results[0] == 4);
        assert(results[1] == 4);
        assert(results[2] == 4);
        done();
    });



})
