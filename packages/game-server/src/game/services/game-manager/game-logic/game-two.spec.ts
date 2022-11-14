import { PLAYERS_PER_GAME } from "@dpg/constants";
import { GameTwoModel, PlayerModel } from "@dpg/types";
import { Game } from "./game.js";
import { GameTwo } from "./game-two.js";
import { v4 as uuidv4 } from "uuid";
import { first } from "rxjs";

jest.mock("./game");
jest.useFakeTimers();

beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});

describe("game 2", () => {
    let gameTwo: GameTwo;
    let game: Game;
    
    // Generate random player IDs to use as a winners and losers list to pass to the GameTwo constructor
    const generateListOfPlayerIds: (n: number) => PlayerModel.Id[] = (numOfIds) => {
        let Ids: PlayerModel.Id[] = [];
        for (let i = 0; i < numOfIds; i++) {
            Ids.push(uuidv4());
        }

        return Ids;
    }
    
    let winners:PlayerModel.Id[];
    let losers:PlayerModel.Id[];

    // Build a random GameTwo action
    const buildAction: (tokenDist: GameTwoModel.TokenDistribution) => GameTwoModel.Turn = (tokenDist: GameTwoModel.TokenDistribution) => ({
        type: "game-two_turn",
        round: 0,
        tokenDistribution: tokenDist,
    });

    // Generate a random distribution of tokens for a TokenDistribution object
    const buildRandomTokenDistribution: () => GameTwoModel.TokenDistribution = () => {
        let keepTokens:number = Math.floor(Math.random() * 11);
        let remainingTokens:number = 10 - keepTokens;
        let competeTokens:number = Math.floor(Math.random() * (remainingTokens + 1));
        let investTokens:number = 10 - keepTokens - competeTokens;
        return {
            compete: competeTokens,
            keep: keepTokens,
            invest: investTokens,
        };
    }

    // isWellFormed() checks if gameTwo.selections is properly formed after submitting actions for each of the six players 
    const isWellFormed = (actions: GameTwoModel.Turn[]) => {
        let selections = gameTwo.getSelections();

        if (selections.size != PLAYERS_PER_GAME) {
            return false;
        }

        for (let i = 0; i < 3; i++) {
            if (selections.get(winners[i]) != actions[i].tokenDistribution) {
                return false
            }
        }
        
        for (let i = 0; i < 3; i++) {
            if (selections.get(losers[i]) != actions[i + 3].tokenDistribution) {
                return false
            }
        }

        return true;
    }

    // This function mimics the behavior of calculateTeamResults in game-two.ts to verify that it is correctly calculating and storing team results
    const verifyTeamResults = (game: GameTwo, listOfActions: GameTwoModel.Turn[], competeCoeff: number, investCoeff: number): boolean => {
        let winningTeamCompeteTotal = listOfActions[0].tokenDistribution.compete + listOfActions[1].tokenDistribution.compete + listOfActions[2].tokenDistribution.compete;
        let winningTeamKeepTotal = listOfActions[0].tokenDistribution.keep + listOfActions[1].tokenDistribution.keep + listOfActions[2].tokenDistribution.keep;
        let winningTeamInvestTotal = listOfActions[0].tokenDistribution.invest + listOfActions[1].tokenDistribution.invest + listOfActions[2].tokenDistribution.invest;
        let losingTeamCompeteTotal = listOfActions[3].tokenDistribution.compete + listOfActions[4].tokenDistribution.compete + listOfActions[5].tokenDistribution.compete;
        let losingTeamKeepTotal = listOfActions[3].tokenDistribution.keep + listOfActions[4].tokenDistribution.keep + listOfActions[5].tokenDistribution.keep;
        let losingTeamInvestTotal = listOfActions[3].tokenDistribution.invest + listOfActions[4].tokenDistribution.invest + listOfActions[5].tokenDistribution.invest;
        
        // Check compete total
        for (let i = 0; i < PLAYERS_PER_GAME; i++) {
            if (i < 3) {
                if (game.getState(winners[i]).teamResults?.winnerTeam.competePenalty != losingTeamCompeteTotal * competeCoeff) {
                    return false;
                }
            } else {
                if (game.getState(losers[i - 3]).teamResults?.loserTeam.competePenalty != winningTeamCompeteTotal * competeCoeff) {
                    console.log("b");
                    return false;
                }
            }
        }
        
        // Check keep total
        for (let i = 0; i < PLAYERS_PER_GAME; i++) {
            if (i < 3) {
                if (game.getState(winners[i]).teamResults?.winnerTeam.totalTokenDistribution.keep != winningTeamKeepTotal) {
                    console.log("c");
                    return false;
                }
            } else {
                if (game.getState(losers[i - 3]).teamResults?.loserTeam.totalTokenDistribution.keep != losingTeamKeepTotal) {
                    console.log("d");
                    return false;
                }
            }
        }

        // Check invest total
        for (let i = 0; i < PLAYERS_PER_GAME; i++) {
            if (i < 3) {
                if (game.getState(winners[i]).teamResults?.winnerTeam.investBonus != winningTeamInvestTotal * investCoeff) {
                    console.log("e");
                    return false;
                }
            } else {
                if (game.getState(losers[i - 3]).teamResults?.loserTeam.investBonus != losingTeamInvestTotal * investCoeff) {
                    console.log("f");
                    return false;
                }
            }
        }

        return true;
    }

    const verifyPlayerResults = (game: GameTwo, listOfActions: GameTwoModel.Turn[]): boolean => {
        let winningTeamTotal = game.getState(winners[0]).teamResults?.winnerTeam;
        let losingTeamTotal = game.getState(losers[0]).teamResults?.loserTeam;
        
        for (let i = 0; i < PLAYERS_PER_GAME; i++) {
            if (i < 3) {
                if (listOfActions[i].tokenDistribution.keep + winningTeamTotal!.investBonus - winningTeamTotal!.competePenalty != game.getState(winners[i]).playerResults?.netTokens) {
                    return false;
                }
            } else {
                if (listOfActions[i].tokenDistribution.keep + losingTeamTotal!.investBonus - losingTeamTotal!.competePenalty != game.getState(losers[i-3]).playerResults?.netTokens) {
                    return false;
                }
            }
        }

        return true;
    }
    
    beforeEach(() => {
        game = <Game>new (<any>Game)();
        winners = game.players.slice(0, 3);
        losers = game.players.slice(3, 6);
        gameTwo = new GameTwo(game, losers, winners);
    });

    it("emits state to players on creation", () => {
        expect(game.emitState).toBeCalledTimes(1);
    });

    it("emits state to players after timeout", () => {
        jest.clearAllMocks();
        expect(game.emitState).not.toBeCalled();
        jest.runOnlyPendingTimers();
        expect(game.emitState).toHaveBeenCalledTimes(1);
    });

    describe("bot actions", () => {
        it("makes player movements when no action is submitted", () => {
            jest.runOnlyPendingTimers();
            
            expect(
                gameTwo.getSelections().size
            ).not.toEqual(0);
        });
    
        it.skip("selects two players that are not itself", () => {
          // TODO: Implement history
        });
    });

    describe("submitting actions", () => {
        it("properly handles submit action", () => {
            let actionOne: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionTwo: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionThree: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionFour: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionFive: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionSix: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            
            gameTwo.submitAction(winners[0], actionOne);
            gameTwo.submitAction(winners[1], actionTwo);
            gameTwo.submitAction(winners[2], actionThree);
            gameTwo.submitAction(losers[0], actionFour);
            gameTwo.submitAction(losers[1], actionFive);
            gameTwo.submitAction(losers[2], actionSix);
    
            let actions: GameTwoModel.Turn[] = [actionOne, actionTwo, actionThree, actionFour, actionFive, actionSix];
    
            expect(isWellFormed(actions)).toBe(true);
        })
    
        // Same test is contained twice simply to verify that this behaves as expected for different random token distributions
        it("properly handles submit action", () => {
            let actionOne: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionTwo: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionThree: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionFour: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionFive: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            let actionSix: GameTwoModel.Turn = buildAction(buildRandomTokenDistribution());
            
            gameTwo.submitAction(winners[0], actionOne);
            gameTwo.submitAction(winners[1], actionTwo);
            gameTwo.submitAction(winners[2], actionThree);
            gameTwo.submitAction(losers[0], actionFour);
            gameTwo.submitAction(losers[1], actionFive);
            gameTwo.submitAction(losers[2], actionSix);
    
            let actions: GameTwoModel.Turn[] = [actionOne, actionTwo, actionThree, actionFour, actionFive, actionSix];
    
            expect(isWellFormed(actions)).toBe(true);
        })
    })

    describe("generating results", () => {
        it("generates correct teamResults", () => {
            let firstAction = buildAction(buildRandomTokenDistribution());
            let secondAction = buildAction(buildRandomTokenDistribution());
            let thirdAction = buildAction(buildRandomTokenDistribution());
            let fourthAction = buildAction(buildRandomTokenDistribution());
            let fifthAction = buildAction(buildRandomTokenDistribution());
            let sixthAction = buildAction(buildRandomTokenDistribution());

            gameTwo.submitAction(winners[0], firstAction);
            gameTwo.submitAction(winners[1], secondAction);
            gameTwo.submitAction(winners[2], thirdAction);
            gameTwo.submitAction(losers[0], fourthAction);
            gameTwo.submitAction(losers[1], fifthAction);
            gameTwo.submitAction(losers[2], sixthAction);

            // List of all actions that were submitted, in order
            let actionList = [firstAction, secondAction, thirdAction,
                              fourthAction, fifthAction, sixthAction];

            // We need to pass these to verifyPossibleTeamResults because following the runOnlyPendingTimers call below,
            // the game moves to the next round, which changes the coefficients
            let roundZeroCompeteCoeff = gameTwo.getState(winners[0]).competeCoefficient;
            let roundZeroInvestCoeff = gameTwo.getState(winners[0]).investCoefficient;

            jest.runOnlyPendingTimers();

            expect(verifyTeamResults(gameTwo, actionList, roundZeroCompeteCoeff, roundZeroInvestCoeff)).toEqual(true);
        });

        it("generates correct playerResults", () => {
            let firstAction = buildAction(buildRandomTokenDistribution());
            let secondAction = buildAction(buildRandomTokenDistribution());
            let thirdAction = buildAction(buildRandomTokenDistribution());
            let fourthAction = buildAction(buildRandomTokenDistribution());
            let fifthAction = buildAction(buildRandomTokenDistribution());
            let sixthAction = buildAction(buildRandomTokenDistribution());

            gameTwo.submitAction(winners[0], firstAction);
            gameTwo.submitAction(winners[1], secondAction);
            gameTwo.submitAction(winners[2], thirdAction);
            gameTwo.submitAction(losers[0], fourthAction);
            gameTwo.submitAction(losers[1], fifthAction);
            gameTwo.submitAction(losers[2], sixthAction);

            // List of all actions that were submitted, in order
            let actionList = [firstAction, secondAction, thirdAction,
                              fourthAction, fifthAction, sixthAction];
            
            let roundZeroCompeteCoeff = gameTwo.getState(winners[0]).competeCoefficient;
            let roundZeroInvestCoeff = gameTwo.getState(winners[0]).investCoefficient;

            jest.runOnlyPendingTimers();

            expect(verifyPlayerResults(gameTwo, actionList)).toEqual(true);
        });  
    })
});