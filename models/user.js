const Joi = require("joi");

class UserModel {
  constructor(name, email, password) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static async validate({ email, password, name }) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(20).required(),
    });
    return schema.validate({ email, password, name });
  }
}

module.exports = UserModel;
