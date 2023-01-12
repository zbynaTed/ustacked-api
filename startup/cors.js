const cors = require("cors");

const logger = require("./logger");

module.exports = function (app) {
  app.use(
    cors({
      origin: [
        "https://localhost:3000",
        "https://localhost:3000/",
        "http://localhost:3000",
        "http://localhost:3000/",
      ],
      methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    })
  );
  logger.info("Cors set.");
};
