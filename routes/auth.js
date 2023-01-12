const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");

const User = require("../database/models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { body: credentials } = req;

  try {
    const result = await User.query()
      .select("id", "password", "name")
      .where("email", credentials.email);

    const { id, password, name } = result[0];

    const validPassword = await bcrypt.compare(credentials.password, password);
    if (!validPassword) return res.status(400).send("Invalid Credentials.");

    const token = jwt.sign({ id, name }, config.get("jwtPrivateKey"));

    return res.status(200).send(token);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
