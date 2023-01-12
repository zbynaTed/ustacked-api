const Joi = require("joi");

class CorporateActionModel {
  constructor(effectiveDate, recordDate, numerator, denominator) {
    this.effectiveDate = effectiveDate;
    this.recordDate = recordDate;
    this.numerator = numerator;
    this.denominator = denominator;
  }

  static validate(corporateAction) {
    const { effectiveDate, recordDate, numerator, denominator } =
      corporateAction;
    const schema = Joi.object({
      effectiveDate: Joi.date(),
      recordDate: Joi.date(),
      numerator: Joi.number().min(1).integer(),
      denominator: Joi.number().min(1).integer(),
    });
    return schema.validate({
      effectiveDate,
      recordDate,
      numerator,
      denominator,
    });
  }
}

module.exports = CorporateActionModel;
