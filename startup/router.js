const express = require("express");

const stocks = require("../routes/stocks");
const companies = require("../routes/companies");
const trades = require("../routes/trades");
const holdings = require("../routes/holdings");
const corporateActions = require("../routes/corporateActions");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/stocks", stocks);
  app.use("/api/companies", companies);
  app.use("/api/trades", trades);
  app.use("/api/holdings", holdings);
  app.use("/api/ca/", corporateActions);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
};
