const express = require("express");

const Trade = require("../database/models/trade");
const TradeModel = require("../models/trades");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", [auth], async (req, res) => {
  const { body: trade } = req;

  if (Number(req.user.id) !== Number(trade.userId))
    return res.status(403).send("Access Denied.");

  // const { error } = TradeModel.validate(trade);
  // if (error) res.status(400).send(error.message);

  try {
    // const { id } = await Trade.query().insert(trade);
    await Trade.query().insert(trade);
    // return res.status(200).send({ id });
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/user/:userId", [auth], async (req, res) => {
  const { userId } = req.params;

  if (parseInt(req.user.id) !== parseInt(userId))
    return res.status(403).send("Access Denied.");

  try {
    const trades = await Trade.query()
      .select("trades.*", "companyId", "symbol", "companies.name")
      .join("stocks", "trades.stockId", "stocks.id")
      .join("companies", "companyId", "companies.id")
      .where("userId", parseInt(userId));

    return res.status(200).send(trades);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.patch("/:id", [auth], async (req, res) => {
  const { id } = req.params;
  const { body: trade } = req;

  if (parseInt(req.user.id) !== parseInt(trade.userId))
    return res.status(403).send("Access Denied.");

  try {
    await Trade.query().findById(parseInt(id)).patch(trade);
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth], async (req, res) => {
  const { id } = req.params;

  try {
    const trade = await Trade.query().findById(parseInt(id));
    if (trade.userId !== req.user.id)
      return res.status(403).send("Access Denied.");

    await Trade.query().deleteById(parseInt(id));
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
