import knex from "knex";

const connection =
  process.env.NODE_ENV === "test"
    ? "postgres://palikkatest_user:palikka123@localhost:5432/palikkatest"
    : process.env.PG_URI || "postgres://palikka_user:palikka123@localhost:5432/palikka";

const knexed = knex({
  client: "pg",
  connection,
  searchPath: ["knex", "public"]
});

const destroy = async (): Promise<any> => {
  await knexed.destroy();
};

export default knexed;
export { destroy };
