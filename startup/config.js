const config = require("config");

const logger = require("./logger");

module.exports = function () {
  if (!config.get("jwtPrivateKey"))
    throw new Error("FATAL ERROR - private key not provided.");
  logger.info("Private key acquired.");
};
