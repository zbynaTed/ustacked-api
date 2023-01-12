const Joi = require("joi");

class CorporateActionTypeModel {
  constructor(name) {
    this.name = name;
  }

  static validate(corporateAction) {
    const { name } = corporateAction;
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
    });
    return schema.validate({ name });
  }
}

module.exports = CorporateActionTypeModel;
