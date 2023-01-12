exports.up = function (knex) {
  return knex.schema
    .createTable("corporateActionsTypes", (table) => {
      table.increments();
      table.string("name", [50]).notNullable();
    })
    .createTable("corporateActions", (table) => {
      table.increments();
      table.integer("stockId").notNullable();
      table.tinyint("caId").notNullable();
      table.date("effectiveDate");
      table.date("recordDate");
      table.smallint("numerator");
      table.smallint("denominator");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("corporateActionsTypes")
    .dropTable("corporateActions");
};
