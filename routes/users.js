const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserModel = require("../models/user");
const User = require("../database/models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { body: user } = req;

  const { error } = await UserModel.validate(user);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    const { id, name } = await User.query().insert(user);
    const token = jwt.sign({ id, name }, config.get("jwtPrivateKey"));

    return res.status(200).send(token);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/usernames/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await User.query().select("id").where("email", email);
    return res.status(200).send(result[0]);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
