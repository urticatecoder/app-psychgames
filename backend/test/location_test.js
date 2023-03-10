const assert = require('assert');
const Room = require('../src/lobby/room.js').Room;
const Player = require('../src/lobby/player.js').Player;
const { getResultsByProlificId, calculateAllDoubleBonuses, calculateAllTripleBonuses,
    countTripleBonuses, countDoubleBonuses, countSingleChoices,
    calculateResults, zeroSumResults, getSinglePairMap,
    getDoublePairMap, getTriplePairMap, isGameOneDone } = require('../src/game_one/game_one.js');


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
        let results = getResultsByProlificId(testID, room)
        for (var i = 0; i < results.length; i++) {
            assert(results[i] !== 0);
        }
        done();
    });
    it('players start at location 50', (done) => {
        var testID = ['test_id1', 'test_id'];
        var choices = [];
        var choices_other = [];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id'));
        room.addPlayer(new Player('test_id1'));
        room.getPlayerWithID('test_id').recordChoices(choices_other);
        room.getPlayerWithID('test_id1').recordChoices(choices);
        let results = getResultsByProlificId(testID, room)
        for (var i = 0; i < results.length; i++) {
            assert(results[i] === 50);
        }
        done();
    });
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

        let singleChoiceCount = countSingleChoices(room);
        assert(singleChoiceCount.get('test_id1') == 2);
        assert(singleChoiceCount.get('test_id2') == 2);
        assert(singleChoiceCount.get('test_id3') == 2);

        let tripleBonuses = calculateAllTripleBonuses(testID, room);
        assert(tripleBonuses[0][0] == 'test_id1');
        assert(tripleBonuses[0][1] == 'test_id2');
        assert(tripleBonuses[0][2] == 'test_id3');

        let tripleBonusCount = countTripleBonuses(tripleBonuses, room);
        assert(tripleBonusCount.get('test_id1') == 1);
        assert(tripleBonusCount.get('test_id2') == 1);
        assert(tripleBonusCount.get('test_id3') == 1);
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

        let singleChoiceCount = countSingleChoices(room);
        assert(singleChoiceCount.get('test_id1') == 2);
        assert(singleChoiceCount.get('test_id2') == 2);
        assert(singleChoiceCount.get('test_id3') == 2);
        assert(singleChoiceCount.get('test_id4') == 2);
        assert(singleChoiceCount.get('test_id5') == 2);
        assert(singleChoiceCount.get('test_id6') == 2);

        let tripleBonuses = calculateAllTripleBonuses(testID, room);
        assert(tripleBonuses[0][0] == 'test_id1');
        assert(tripleBonuses[0][1] == 'test_id2');
        assert(tripleBonuses[0][2] == 'test_id3');
        assert(tripleBonuses[1][0] == 'test_id4');
        assert(tripleBonuses[1][1] == 'test_id5');
        assert(tripleBonuses[1][2] == 'test_id6');

        let tripleBonusCount = countTripleBonuses(tripleBonuses, room);
        assert(tripleBonusCount.get('test_id1') == 1);
        assert(tripleBonusCount.get('test_id2') == 1);
        assert(tripleBonusCount.get('test_id3') == 1);
        assert(tripleBonusCount.get('test_id4') == 1);
        assert(tripleBonusCount.get('test_id5') == 1);
        assert(tripleBonusCount.get('test_id6') == 1);

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

        let singleChoiceCount = countSingleChoices(room);
        assert(singleChoiceCount.get('test_id1') == 1);
        assert(singleChoiceCount.get('test_id2') == 1);
        assert(singleChoiceCount.get('test_id3') == 2);

        let doubleBonuses = calculateAllDoubleBonuses(testID, room);
        assert(doubleBonuses.length == 2);
        let doubleBonusCount = countDoubleBonuses(doubleBonuses, room);
        assert(doubleBonusCount.get('test_id1') == 1);
        assert(doubleBonusCount.get('test_id2') == 1);
        assert(doubleBonusCount.get('test_id3') == 2);
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
    // it('calculates location correctly for no single bonuses', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id3'];
    //     var choicesTwo = ['test_id3'];
    //     var choicesThree = ['test_id2', 'test_id1'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     let resultsOne = getResults('test_id1',testID, room);
    //     let resultsTwo = getResults('test_id2',testID, room);
    //     let resultsThree = getResults('test_id3',testID, room);
    //     assert(resultsOne == 8);
    //     assert(resultsTwo == 8);
    //     assert(resultsThree == 16);
    //     done();
    // });
    // it('calculates location correctly for single bonuses', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id2'];
    //     var choicesTwo = ['test_id3'];
    //     var choicesThree = ['test_id1'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     let resultsOne = getResults('test_id1',testID, room);
    //     let resultsTwo = getResults('test_id2',testID, room);
    //     let resultsThree = getResults('test_id3',testID, room);
    //     assert(resultsOne == 4);
    //     assert(resultsTwo == 4);
    //     assert(resultsThree == 4);
    //     done();
    // });
    // it('calculates location correctly for single and double bonuses', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id2', 'test_id3'];
    //     var choicesTwo = ['test_id1'];
    //     var choicesThree = ['test_id1', 'test_id2'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     let resultsOne = getResults('test_id1',testID, room);
    //     let resultsTwo = getResults('test_id2',testID, room);
    //     let resultsThree = getResults('test_id3',testID, room);
    //     assert(resultsOne == 16);
    //     assert(resultsTwo == 12);
    //     assert(resultsThree == 8);
    //     done();
    // });
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

        let singleChoiceCount = countSingleChoices(room);
        assert(singleChoiceCount.get('test_id1') == 1);
        assert(singleChoiceCount.get('test_id2') == 1);
        assert(singleChoiceCount.get('test_id3') == 1);

        let double = calculateAllDoubleBonuses(testID, room);
        assert(double.length == 0);

        let triple = calculateAllTripleBonuses(testID, room);
        assert(triple.length == 0);
        done();
    });
    // it('zero sum locations', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id3'];
    //     var choicesTwo = ['test_id1'];
    //     var choicesThree = ['test_id2'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     let results = getResultsByProlificId(testID, room);
    //     assert(results[0] == 0);
    //     assert(results[1] == 0);
    //     assert(results[2] == 0);
    //     done();
    // });
    // it('zero sum locations', (done) => {
    //     const testID = ['test_id1', 'test_id2', 'test_id3'];
    //     var choicesOne = ['test_id3'];
    //     var choicesTwo = [];
    //     var choicesThree = ['test_id2'];
    //     const room = new Room('room 0');
    //     room.addPlayer(new Player('test_id1'));
    //     room.addPlayer(new Player('test_id2'));
    //     room.addPlayer(new Player('test_id3'));
    //     room.getPlayerWithID('test_id1').recordChoices(choicesOne);
    //     room.getPlayerWithID('test_id3').recordChoices(choicesThree);
    //     room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
    //
    //     let results = getResultsByProlificId(testID, room);
    //     // console.log(results);
    //     assert(results[0] == -2.6666666666666665);
    //     assert(results[1] == 1.3333333333333335);
    //     assert(results[2] == 1.3333333333333335);
    //     done();
    // });
    it('identify no passiveness in player', (done) => {
        const choicesOne = ['test_id3'];
        const choicesTwo = [];
        const choicesThree = ['test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        assert(room.hasPlayerConfirmed('test_id1') == true);
        assert(room.hasPlayerConfirmed('test_id2') == false);
        assert(room.hasPlayerConfirmed('test_id3') == true);

        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        assert(room.hasPlayerConfirmed('test_id2') == true);

        done();
    })
    it('identify passiveness in player', (done) => {
        const choicesOne = [];
        const choicesTwo = [];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        assert(room.hasPlayerConfirmed('test_id1') === true);
        assert(room.hasPlayerConfirmed('test_id2') === true);
        assert(room.hasPlayerConfirmed('test_id3') === false);
        done();
    })
    it('calculates zero sum to be 0', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        let ans = [4, 4, 4];
        let result = zeroSumResults(ans, testID, room);
        assert(result[0] === 0);
        assert(result[1] === 0);
        assert(result[2] === 0);
        done();
    });
    it('calculates zero sum with different values', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        let ans = [8, 16, 12];
        let result = zeroSumResults(ans, testID, room);
        assert(result[0] === -4);
        assert(result[1] === 4);
        assert(result[2] === 0);
        done();
    });
    it('calculates zero sum with 6 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3', 'test_id4', 'test_id5', 'test_id6'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        let ans = [8, 16, 12, 0, 0, 0];
        let result = zeroSumResults(ans, testID, room);
        assert(result[0] === 2);
        assert(result[1] === 10);
        assert(result[2] === 6);
        assert(result[3] === -6);
        assert(result[4] === -6);
        assert(result[5] === -6);
        done();
    });
    it('calculates zero sum with 6 players and decimal values', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3', 'test_id4', 'test_id5', 'test_id6'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        let ans = [19, 15, 4, 15, 0, 4];
        let result = zeroSumResults(ans, testID, room);
        assert(result[0] === 9.5);
        assert(result[1] === 5.5);
        assert(result[2] === -5.5);
        assert(result[3] === 5.5);
        assert(result[4] === -9.5);
        assert(result[5] === -5.5);
        done();
    });
    it('calculates zero sum with 3 players and endless decimals', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        let ans = [0, 12, 8];
        let result = zeroSumResults(ans, testID, room);
        assert(result[0] === -6.666666666666667);
        assert(result[1] === 5.333333333333333);
        assert(result[2] === 1.333333333333333);
        done();
    });
    it('returns the zero sum locations', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = [];
        var choicesTwo = [];
        var choicesThree = [];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        let result = getResultsByProlificId(testID, room);
        assert(result[0] === 50);
        assert(result[1] === 50);
        assert(result[2] === 50);
        done();
    });
    it('returns the zero sum locations and records them', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2'];
        var choicesTwo = ['test_id1', 'test_id3'];
        var choicesThree = ['test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        let result = getResultsByProlificId(testID, room);
        let endResults = room.playerLocations;
        assert(result[0] === 54 && endResults.get('test_id1') === 54);
        assert(result[1] === 50 && endResults.get('test_id2') === 50);
        assert(result[2] === 46 && endResults.get('test_id3') === 46);
        done();
    });
    it('no bonuses 3 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = [];
        var choicesTwo = [];
        var choicesThree = [];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(single.get(player) === 0);
            assert(double.get(player) === 0);
            assert(triple.get(player) === 0);
        }
        done();
    });
    it('single bonuses 3 players', (done) => {
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
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(single.get(player) === 1);
            assert(double.get(player) === 0);
            assert(triple.get(player) === 0);
        }
        done();
    });
    it('double bonuses 3 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id1'];
        var choicesThree = ['test_id1'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(single.get(player) === 0);
            assert(triple.get(player) === 0);
        }
        assert(double.get(testID[0]) === 2);
        assert(double.get(testID[1]) === 1 && double.get(testID[2]) === 1);
        done();
    });
    it('1 triple bonus 3 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id3', 'test_id1'];
        var choicesThree = ['test_id1', 'test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(single.get(player) === 0);
            assert(double.get(player) === 0);
            assert(triple.get(player) === 1);
        }
        done();
    });
    it('2 triple bonus 6 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3', 'test_id4', 'test_id5', 'test_id6'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id3', 'test_id1'];
        var choicesThree = ['test_id1', 'test_id2'];
        var choicesFour = ['test_id5', 'test_id6'];
        var choicesFive = ['test_id4', 'test_id6'];
        var choicesSix = ['test_id4', 'test_id5'];
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
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(single.get(player) === 0);
            assert(double.get(player) === 0);
            assert(triple.get(player) === 1);
        }
        done();
    });
    it('single and double bonuses 3 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = [];
        var choicesThree = ['test_id1', 'test_id2'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.getPlayerWithID('test_id1').recordChoices(choicesOne);
        room.getPlayerWithID('test_id3').recordChoices(choicesThree);
        room.getPlayerWithID('test_id2').recordChoices(choicesTwo);
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(triple.get(player) === 0);
        }
        assert(single.get(testID[0]) === 0 && double.get(testID[0]) === 1);
        assert(single.get(testID[1]) === 2 && double.get(testID[1]) === 0);
        assert(single.get(testID[2]) === 0 && double.get(testID[2]) === 1);
        done();
    });
    it('single and double bonuses 6 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3', 'test_id4', 'test_id5', 'test_id6'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id5'];
        var choicesThree = ['test_id1', 'test_id2'];
        var choicesFour = ['test_id3', 'test_id5'];
        var choicesFive = ['test_id2'];
        var choicesSix = ['test_id1', 'test_id4'];
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
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        for (var i = 0; i < testID.length; i++) {
            let player = testID[i];
            assert(triple.get(player) === 0);
        }
        assert(single.get(testID[0]) === 1 && double.get(testID[0]) === 1);
        assert(single.get(testID[1]) === 2 && double.get(testID[1]) === 1);
        assert(single.get(testID[2]) === 1 && double.get(testID[2]) === 1);
        assert(single.get(testID[3]) === 1 && double.get(testID[3]) === 0);
        assert(single.get(testID[4]) === 1 && double.get(testID[4]) === 1);
        assert(single.get(testID[5]) === 0 && double.get(testID[5]) === 0);
        done();
    });
    it('does Game 1 end', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.setPlayerLocation('test_id1', 100);
        room.setPlayerLocation('test_id2', 120);
        room.setPlayerLocation('test_id3', 130);
        assert(isGameOneDone(room) === true);
        done();
    });
    it('1 triple bonus and double/single 6 players', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3', 'test_id4', 'test_id5', 'test_id6'];
        var choicesOne = ['test_id2', 'test_id3'];
        var choicesTwo = ['test_id3', 'test_id1'];
        var choicesThree = ['test_id1', 'test_id2'];
        var choicesFour = ['test_id5', 'test_id6'];
        var choicesFive = ['test_id6'];
        var choicesSix = ['test_id5', 'test_id2'];
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
        let single = getSinglePairMap(testID, room);
        let double = getDoublePairMap(testID, room);
        let triple = getTriplePairMap(testID, room);
        done();
    });
    it('winners and losers game 1', (done) => {
        const testID = ['test_id1', 'test_id2', 'test_id3'];
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.addPlayer(new Player('test_id3'));
        room.addPlayer(new Player('test_id4'));
        room.addPlayer(new Player('test_id5'));
        room.addPlayer(new Player('test_id6'));
        room.setPlayerLocation('test_id1', 100);
        room.setPlayerLocation('test_id2', 120);
        room.setPlayerLocation('test_id3', 130);
        room.setPlayerLocation('test_id4', 180);
        room.setPlayerLocation('test_id5', 60);
        room.setPlayerLocation('test_id6', 0);
        done();
    });

})
