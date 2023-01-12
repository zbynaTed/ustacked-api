const { Model } = require("objection");
const knex = require("knex");

const knexfile = require("../database/knexfile");

function dbSetup() {
  const db = knex(knexfile.development);
  Model.knex(db);
}

module.exports = dbSetup;
