const config = require("config");
const { knexSnakeCaseMappers } = require("objection");

const password = config.get("postgresPassword");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "stacked",
      user: "postgres",
      password,
      port: 5432,
      // connectionString: process.env.DATABASE_URL,
    },
    pool: {
      min: 2,
      max: 10,
    },
    // migrations: {
    //   tableName: "knex_migrations",
    // },
    // seeds: {
    //   directory: "./seeds",
    // },

    ...knexSnakeCaseMappers(),
  },
  // production: {
  //   client: "postgresql",
  //   connection: {
  //     connectionString: process.env.DATABASE_URL,
  //     ssl: { rejectUnauthorized: false },
  //   },
  //   ...knexSnakeCaseMappers(),
  // },
  ...knexSnakeCaseMappers(),
};
