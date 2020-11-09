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
