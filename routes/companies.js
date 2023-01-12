const express = require("express");
// const { raw } = require("objection");

const Company = require("../database/models/company");
const auth = require("../middleware/auth");
const CompanyModel = require("../models/company");

const router = express.Router();

router.post("/", [auth], async (req, res) => {
  const { name, publiclyTraded } = req.body;

  const company = new CompanyModel(name, publiclyTraded);
  const { error } = CompanyModel.validate(company);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await Company.query().insert({
      name: company.name,
      publiclyTraded: company.publiclyTraded,
    });
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const companies = await Company.query().select();
    return res.status(200).send(companies);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/string/:string", async (req, res) => {
  const { string } = req.params;

  try {
    const companies = await Company.query()
      .select()
      // .where("name", "like", `%${string}%`);
      .where(Company.raw('lower("name")'), "like", `%${string}%`);
    return res.status(200).send(companies);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/:id", [auth], async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.query().findById(parseInt(id));
    return res.status(200).send(company);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.patch("/:id", [auth], async (req, res) => {
  const { id } = req.params;
  const { body: company } = req;

  const { error } = CompanyModel.validate(company);
  if (error && error.details) {
    const { path } = error.details[0];
    if (path && path.includes("name"))
      return res.status(400).send(error.details[0].message);
  }

  try {
    await Company.query().findById(parseInt(id)).patch({
      name: company.name,
      publiclyTraded: company.publiclyTraded,
    });
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth], async (req, res) => {
  const { id } = req.params;

  try {
    await Company.query().deleteById(parseInt(id));
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
