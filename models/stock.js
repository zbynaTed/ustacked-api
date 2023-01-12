const Joi = require("joi");

class StockModel {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }

  static validate({ name, symbol }) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      symbol: Joi.string().min(1).max(10).required(),
    });
    return schema.validate({ name, symbol });
  }
}

module.exports = StockModel;
