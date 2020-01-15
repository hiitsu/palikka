import knex from "knex";

const db = knex({
  client: "pg",
  connection: process.env.PG_URI,
  searchPath: ["knex", "public"]
});

export default db;
