const cors = require("cors");

const logger = require("./logger");

module.exports = function (app) {
  app.use(
    cors({
      origin: [
        "https://ustacked.herokuapp.com",
        "https://ustacked.herokuapp.com/",
        "http://ustacked.herokuapp.com",
        "http://ustacked.herokuapp.com/"
      ],
      methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    })
  );
  logger.info("Cors set.");
};
