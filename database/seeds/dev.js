exports.seed = async function (knex) {
  await knex.raw('TRUNCATE TABLE "companies" CASCADE');
  await knex.raw('TRUNCATE TABLE "stocks" CASCADE');

  await knex("companies").insert([
    {
      name: "Alphabet Inc.",
      publiclyTraded: true,
    },
  ]);

  await knex("stocks").insert([
    {
      companyId: 4,
      symbol: "GOOG",
    },
  ]);
};
