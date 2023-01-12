const _ = require("lodash");

async function pickUserCorporateActions(
  allCorporateActions,
  userHoldingsHistory
) {
  const userCorporateActions = [];
  const corporateActions = _.groupBy(allCorporateActions, "stockId");

  for (let caId in corporateActions) {
    const effectiveDate = corporateActions[caId][0].effectiveDate;

    for (let stockHolding in userHoldingsHistory) {
      const holding = userHoldingsHistory[stockHolding][caId];

      if (holding) {
        let position = holding.length - 1;
        let balance = holding[position].balance;
        while (holding[position].tradeDate > effectiveDate) {
          position--;
        }
        if (balance !== 0)
          userCorporateActions.push({ [caId]: holding[position] });
      }
    }
  }
  return userCorporateActions;
}

module.exports = pickUserCorporateActions;
