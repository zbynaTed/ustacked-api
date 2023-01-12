const { Model } = require("objection");

class CorporateAction extends Model {
  static get tableName() {
    return "corporateActions";
  }

  static get relationMappings() {
    const CorporateActionType = require("./corporateActionType");
    const Stock = require("./stock");
    const Company = require("./company");

    return {
      corporateActionType: {
        relation: Model.BelongsToOneRelation,
        modelClass: CorporateActionType,
        join: {
          from: "corporateActionsTypes.id",
          to: "corporateActions.caId",
        },
      },
      stock: {
        relation: Model.BelongsToOneRelation,
        modelClass: Stock,
        join: {
          from: "corporateActions.stockId",
          to: "stocks.id",
        },
      },
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: "corporateActions.companyId",
          to: "company.id",
        },
      },
    };
  }
}

module.exports = CorporateAction;
