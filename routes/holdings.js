const express = require("express");

const auth = require("../middleware/auth");
const fetchTradeHistory = require("../utils/fetchTradeHistory");

const router = express.Router();

router.get("/user/:id/current", [auth], async (req, res) => {
  const { id: userId } = req.params;

  if (parseInt(req.user.id) !== parseInt(userId))
    return res.status(403).send("Access Denied.");

  try {
    const holdings = await fetchTradeHistory(userId, "lastTrade");
    return res.status(200).send(holdings);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/user/:id/history", [auth], async (req, res) => {
  const { id: userId } = req.params;

  if (parseInt(req.user.id) !== parseInt(userId))
    return res.status(403).send("Access Denied.");

  try {
    const holdings = await fetchTradeHistory(userId, "allTrades");
    return res.status(200).send(holdings);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
