const express = require("express");

const Company = require("../database/models/company");
const Stock = require("../database/models/stock");
const StockModel = require("../models/stock");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", [auth], async (req, res) => {
  const { name, symbol } = req.body;

  const stock = new StockModel(name, symbol);
  const { error } = StockModel.validate(stock);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { id } = await Company.query().insert({
      name: stock.name,
    });
    await Stock.query().insert({
      companyId: id,
      symbol: stock.symbol,
    });
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/symbols", [auth], async (req, res) => {
  try {
    const symbols = await Stock.query().select("id", "symbol");
    return res.status(200).send(symbols);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/symbols/symbol/:symbol", [auth], async (req, res) => {
  const { symbol } = req.params;

  try {
    const stock = await Stock.query()
      .select("stocks.id", "stocks.symbol", "companies.id as companyId")
      .join("companies", "companies.id", "stocks.companyId")
      .where("symbol", symbol);
    return res.status(200).send(stock);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.query()
      .select(
        "stocks.id",
        "stocks.symbol",
        "companies.id as companyId",
        "companies.name"
      )
      .join("companies", "companies.id", "stocks.companyId");
    return res.status(200).send(stocks);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/:id", [auth], async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await Stock.query()
      .findById(parseInt(id))
      .withGraphFetched("company");
    return res.status(200).send(stock);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.patch("/:id", [auth], async (req, res) => {
  const { id } = req.params;
  const { body: stock } = req;

  const { error } = StockModel.validate(stock);

  if (error) {
    path = error.details[0].path;
    if (path.includes("symbol"))
      return res.status(400).send(error.details[0].message);
  }

  try {
    await Company.query()
      .findById(parseInt(stock.companyId))
      .patch({ name: stock.name });
    await Stock.query().findById(parseInt(id)).patch({ symbol: stock.symbol });
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth], async (req, res) => {
  const { id } = req.params;

  try {
    await Stock.query().deleteById(parseInt(id));
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
