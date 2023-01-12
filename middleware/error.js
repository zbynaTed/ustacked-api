const logger = require("../startup/logger");

function error(err, req, res, next) {
  logger.error(err.message);
  return res.status(500).send("An http error occured.");
}

module.exports = error;
