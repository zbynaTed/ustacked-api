const { Model } = require("objection");

class Stock extends Model {
  static get tableName() {
    return "stocks";
  }

  static get relationMappings() {
    const Company = require("./company");
    const CorporateAction = require("./corporateAction");

    return {
      company: {
        relation: Model.HasManyRelation,
        modelClass: Company,
        join: {
          from: "companies.id",
          to: "stocks.companyId",
        },
      },
      corporateAction: {
        relation: Model.HasOneRelation,
        modelClass: CorporateAction,
        join: {
          from: "stocks.id",
          to: "corporateActions.stockId",
        },
      },
    };
  }
}

module.exports = Stock;
