const express = require("express");

const auth = require("../middleware/auth");
const CorporateAction = require("../database/models/corporateAction");
const CorporateActionType = require("../database/models/corporateActionType");
const Stock = require("../database/models/stock");

const CorporateActionModel = require("../models/corporateAction");
const pickUserCorporateActions = require("../utils/userCorporateActions");
const fetchTradeHistory = require("../utils/fetchTradeHistory");

const router = express.Router();

router.post("/", [auth], async (req, res) => {
  const { body: corporateAction } = req;

  try {
    await CorporateAction.query().insert(corporateAction);
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/types", [auth], async (req, res) => {
  try {
    const caTypes = await CorporateActionType.query();
    return res.status(200).send(caTypes);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/", [auth], async (req, res) => {
  try {
    const allCorporateActions = await CorporateAction.query()
      .select("corporate_actions.*", "corporate_actions_types.name", "symbol")
      .join(
        "corporate_actions_types",
        "corporate_actions.caId",
        "corporate_actions_types.id"
      )
      .join("stocks", "corporate_actions.stockId", "stocks.id");

    return res.status(200).send(allCorporateActions);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/user/:id", [auth], async (req, res) => {
  const { id: userId } = req.params;

  if (parseInt(req.user.id) !== parseInt(userId))
    return res.status(403).send("Access Denied.");

  try {
    const allCorporateActions = await CorporateAction.query().select();
    const userHoldings = await fetchTradeHistory(userId, "allTrades");
    const userCorporateActions = await pickUserCorporateActions(
      allCorporateActions,
      userHoldings
    );

    return res.status(200).send(userCorporateActions);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.patch("/:id", [auth], async (req, res) => {
  const { id } = req.params;
  const { body: caData } = req;

  try {
    await CorporateAction.query().findById(parseInt(id)).patch(caData);
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth], async (req, res) => {
  const { id } = req.params;

  try {
    await CorporateAction.query().deleteById(parseInt(id));
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
