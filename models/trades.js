const Joi = require("joi");

class TradeModel {
  constructor(userId, stockId, quantity, price, fee, buy, date) {
    this.userId = userId;
    this.stockId = stockId;
    this.quantity = quantity;
    this.price = price;
    this.fee = fee;
    this.buy = buy;
    this.date = date;
  }

  static validate({ userId, stockId, quantity, price, fee, buy, tradeDate }) {
    const schema = Joi.object({
      userId: Joi.number().integer().required(),
      stockId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).max(99999).required(),
      price: Joi.number().min(0.0001).max(999999.9999).required(),
      fee: Joi.number().required(),
      buy: Joi.boolean().required(),
      tradeDate: Joi.date().required(),
    });
    return schema.validate({
      userId,
      stockId,
      quantity,
      price,
      fee,
      buy,
      tradeDate,
    });
  }
}

module.exports = TradeModel;
