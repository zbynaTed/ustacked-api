const express = require("express");

const app = express();

require("./startup/config")();
require("./startup/logger");
require("./startup/server")(app);
require("./startup/cors")(app);
require("./startup/router")(app);
require("./startup//db")();
