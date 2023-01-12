const Joi = require("joi");

class CompanyModel {
  constructor(name, publiclyTraded) {
    this.name = name;
    this.publiclyTraded = publiclyTraded;
  }

  static validate(company) {
    const { name, publiclyTraded } = company;
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      publiclyTraded: Joi.boolean(),
    });
    return schema.validate({ name, publiclyTraded });
  }
}

module.exports = CompanyModel;
