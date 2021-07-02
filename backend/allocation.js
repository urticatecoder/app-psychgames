/**
 * Class representing the amount of tokens allocated for each token category.
 * It has a few static helper functions for aggregating instances of Allocation
 */
class Allocation {
  static TOKEN_VALUE = 0.5;
  static POSSIBLE_PAYOFF = [0, 0.5, 1];

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

  get allocationAsArray() {
    return [this.compete, this.keep, this.invest];
  }

  /**
   * @param allocation1 must be an instance of Allocation
   * @param allocation2 must be an instance of Allocation
   * @return {Allocation}
   */
  static addAllocations(allocation1, allocation2) {
    if (!(allocation1 instanceof Allocation) || !(allocation2 instanceof Allocation)) {
      throw 'Not an instance of Allocation.';
    }
    return new Allocation(allocation1.numOfCompeteToken + allocation2.numOfCompeteToken,
      allocation1.numOfKeepToken + allocation2.numOfKeepToken,
      allocation1.numOfInvestToken + allocation2.numOfInvestToken);
  }

  /**
   * @param allocations {Allocation[]}
   * @return {Allocation}
   */
  static sumAllocations(allocations) {
    let sum = new Allocation(0, 0, 0);
    allocations.forEach((allocation) => {
      sum = Allocation.addAllocations(sum, allocation);
    });
    return sum;
  }
}

module.exports = {
  Allocation: Allocation,
}