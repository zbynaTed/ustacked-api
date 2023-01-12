const { Model } = require("objection");

class CorporateActionType extends Model {
  static get tableName() {
    return "corporateActionsTypes";
  }

  static get relationMappings() {
    const CorporateAction = require("./corporateAction");
    return {
      corporateAction: {
        relation: Model.HasManyRelation,
        modelClass: CorporateAction,
        join: {
          to: "corporateActionsTypes.id",
          from: "corporateActions.caId",
        },
      },
    };
  }
}

module.exports = CorporateActionType;
