class GameOneTurnResult {
  /**
   * @constructor
   */
  constructor(singleChoiceCounts, doubleBonusCounts, doubleBonuses, tripleBonusCounts, tripleBonuses, allPlayersResults) {
    this.singleChoiceCounts = singleChoiceCounts;
    this.doubleBonusCounts = doubleBonusCounts;
    this.doubleBonuses = doubleBonuses;
    this.tripleBonusCounts = tripleBonusCounts;
    this.tripleBonuses = tripleBonuses;
    this.allPlayersResults = allPlayersResults;
  }
}

module.exports = {
  GameOneTurnResult,
}