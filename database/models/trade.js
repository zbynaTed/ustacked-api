const { Model } = require("objection");

class Trade extends Model {
  static get tableName() {
    return "trades";
  }

  static get relationMappings() {
    const Stock = require("./stock");
    const Company = require("./company");

    return {
      stock: {
        relation: Model.HasOneRelation,
        modelClass: Stock,
        join: {
          from: "stocks.id",
          to: "trades.stockId",
        },
      },
    };
  }
}

module.exports = Trade;
