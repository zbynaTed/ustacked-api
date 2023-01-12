exports.up = function (knex) {
  return knex.schema.createTable("trades", (table) => {
    table.increments();
    table.integer("userId").notNullable();
    table.integer("stockId").notNullable();
    table.integer("quantity").notNullable();
    table.decimal("price", [10], [4]).notNullable();
    table.decimal("fee", [4], [2]).notNullable();
    table.boolean("buy").notNullable();
    table.date("tradeDate").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("trades");
};
