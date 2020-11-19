/**
 * @author Nick DeCapite
 * determines who the bot selects every single round based on random choice
 * will have a model for selection implemented over winter break
 */

/**
 * @param selfID {string} of bot
 * @param prolificIDs {string array} of players in game
 * @returns botChoices {string list}
 */
function determineBotChoice(selfID, prolificIDs) {
    let numberOfChoices = 2;
    let botChoices = [];
    for (let i = 0; i < numberOfChoices; i++) {
        let randomIndex = Math.floor(Math.random() * prolificIDs.length);
        while (prolificIDs[randomIndex] === selfID || botChoices.includes(prolificIDs[randomIndex])) {
            randomIndex = Math.floor(Math.random() * prolificIDs.length);
        }
        botChoices.push(prolificIDs[randomIndex]);
    }
    return botChoices;
}


module.exports = {
    determineBotChoice: determineBotChoice,
}
