const _ = require("lodash");

const Trade = require("../database/models/trade");
const CorporateAction = require("../database/models/corporateAction");
const tradeHistory = require("./tradeHistory");

async function fetchTradeHistory(userId, outputType) {
  const holdings = [];

  try {
    const corporateActions = await CorporateAction.query()
      .select("corporate_actions.*", "corporate_actions_types.name", "symbol")
      .join(
        "corporate_actions_types",
        "corporate_actions.caId",
        "corporate_actions_types.id"
      )
      .join("stocks", "corporate_actions.stockId", "stocks.id");

    const trades = await Trade.query()
      .select(
        "trades.*",
        "stocks.symbol",
        "stocks.closePrice",
        "companies.name"
      )
      .join("stocks", "trades.stockId", "stocks.id")
      .join("companies", "stocks.companyId", "companies.id")
      .where("userId", userId);

    const groupedTrades = _.groupBy(trades, "stockId");

    // holdings.push(
    //   tradeHistory(groupedTrades[11], corporateActions)[outputType]
    // );

    for (let t in groupedTrades) {
      holdings.push(
        tradeHistory(groupedTrades[t], corporateActions)[outputType]
      );
    }

    return holdings;
  } catch (error) {
    return error.message;
  }
}

module.exports = fetchTradeHistory;
