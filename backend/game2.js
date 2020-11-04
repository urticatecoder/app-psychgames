class GameTwoAllocation {
    static TOKEN_VALUE = 0.5;
    static POSSIBLE_PAYOFF = [0, 0.5, 1, 1.5, 2];

    constructor(compete, keep, invest) {
        this.compete = compete;
        this.keep = keep;
        this.invest = invest;
    }

    get numOfCompeteToken() {
        return this.compete;
    }

    get numOfKeepToken() {
        return this.keep;
    }

    get numOfInvestToken() {
        return this.invest;
    }
}

function calculatePaymentForAPlayerAtTurn(prolificID, room, turnNum) {
    let tokenValue = GameTwoAllocation.TOKEN_VALUE;
    let payoff = room.getCompeteAndInvestPayoffAtTurnNum(turnNum);
    let competePayoff = payoff[0], investPayoff = payoff[1];
    let playerAllocation = room.getPlayerAllocationAtTurnNum(prolificID, turnNum);
    let payment = 0;
    payment += (tokenValue * playerAllocation.numOfKeepToken + investPayoff * playerAllocation.numOfInvestToken + competePayoff * playerAllocation.numOfCompeteToken);

    let allocations = room.getOthersAllocationAtTurnNum(prolificID, turnNum);
    let teammatesAllocations = allocations[0];
    let opponentsAllocations = allocations[1];
    teammatesAllocations.forEach((allocation) => {
        // add compete and invest tokens allocated by your teammates
        payment += (investPayoff * allocation.numOfInvestToken);
        payment += (competePayoff * allocation.numOfCompeteToken);
    });

    // opponents impact
    opponentsAllocations.forEach((allocation) => {
       payment -= (competePayoff * allocation.numOfCompeteToken);
    });

    return payment;
}

function generateCompeteAndInvestPayoff() {
    let allPairs = [];
    GameTwoAllocation.POSSIBLE_PAYOFF.forEach((competePayoff) => {
        GameTwoAllocation.POSSIBLE_PAYOFF.forEach((investPayoff) => {
            allPairs.push([competePayoff, investPayoff]);
        });
    });

    shuffleArray(allPairs);
    return allPairs;
}

/* adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = {
    GameTwoAllocation,
    generateCompeteAndInvestPayoff: generateCompeteAndInvestPayoff,
    calculatePaymentForAPlayerAtTurn: calculatePaymentForAPlayerAtTurn,
}
