const { Model } = require("objection");

class Company extends Model {
  static get tableName() {
    return "companies";
  }

  static get relationMappings() {
    const Stock = require("./stock");

    return {
      stocks: {
        relation: Model.BelongsToOneRelation,
        modelClass: Stock,
        join: {
          from: "companies.id",
          to: "stocks.companyId",
        },
      },
    };
  }
}

module.exports = Company;
