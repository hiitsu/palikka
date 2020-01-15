import knex from "knex";

const knexed = knex({
  client: "pg",
  connection: process.env.PG_URI || "postgres://palikka_user:palikka123@localhost:5432/palikka",
  searchPath: ["knex", "public"]
});

const destroy = async (): Promise<any> => {
  await knexed.destroy();
};

export default knexed;
export { destroy };
