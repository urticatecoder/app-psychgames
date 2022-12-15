import mongoose from "mongoose";

const gameOneSchema = new mongoose.Schema({
  experimentID: String,
  experimentStartTime: String,
  decisionTime: String,
  roundStartTime: String,
  roundEndTime: String,
  playerID: String,
  prolificID: String,
  turnNumber: Number,
  selectedIDOne: String,
  selectedIDTwo: String,
  madeByBot: Boolean,
  oldLocation: Number,
  newLocation: Number,

  //Leave this count to the be performed during data analysis
  //singleChoiceCount: Number,
  doubleBonusCount: Number,
  tripleBonusCount: Number,
});

const gameTwoSchema = new mongoose.Schema({
  experimentID: String,
  experimentStartTime: String,
  decisionTime: String,
  roundStartTime: String,
  roundEndTime: String,
  playerID: String,
  prolificID: String,
  turnNumber: Number,
  keepTokens: Number,
  investTokens: Number,
  competeTokens: Number,
  investPayoff: Number,
  competePayoff: Number,
  madeByBot: Boolean,
  receiptTurnNum: Number,
  teamKeepTotal: Number,
  teamInvestTotal: Number,
  teamCompeteTotal: Number,
  teamInvestPayoff: Number,
  teamCompetePenalty: Number,
});

const GameOneDataModel = mongoose.model("GameOneDataModel", gameOneSchema);
const GameTwoDataModel = mongoose.model("GameTwoDataModel", gameTwoSchema);

export { GameOneDataModel, GameTwoDataModel };
