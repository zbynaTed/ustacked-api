exports.up = function (knex) {
  return knex.schema
    .createTable("companies", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.boolean("publiclyTraded").notNullable().defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable("stocks", (table) => {
      table.increments();
      table
        .integer("companyId")
        .notNullable()
        .references("id")
        .inTable("companies");
      table.string("symbol").notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("companies").dropTable("stocks");
};
