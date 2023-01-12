exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("name", [30]).notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("isAdmin");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
