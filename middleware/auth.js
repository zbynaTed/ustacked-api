const jwt = require("jsonwebtoken");
const config = require("config");

const logger = require("../startup/logger");

function auth(req, res, next) {
  if (!config.get("requiresAuth")) return next();
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Unauthorized Access.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(error.message);
    res.status(401).send("Invalid token.");
  }
}

module.exports = auth;
