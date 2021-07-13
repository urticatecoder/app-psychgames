const expect = require('chai').expect;
const BOT = require('../src/lobby/bot');

describe("Bot choice test", function () {
    it("determineBotChoice works correctly", function (done) {
        let id = 'bot1';
        let ids = ['testid', 'bot1', 'bot2', 'bot3', 'bot4', 'bot5'];
        let idExcludingSelf = ['testid', 'bot2', 'bot3', 'bot4', 'bot5'];
        let choices = BOT.generateBotChoices(id, ids);
        expect(idExcludingSelf).to.include.members(choices);
        expect(choices).to.not.include(id);
        done();
    });
});
