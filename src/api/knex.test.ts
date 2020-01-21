import knex, { destroy } from "./knex";

describe("database", () => {
  function swallow() {}
  async function cleanup() {
    await knex("jsontest")
      .del()
      .catch(swallow);
    await knex.schema.dropTable("jsontest").catch(swallow);
    await knex("arraytest")
      .del()
      .catch(swallow);
    await knex.schema.dropTable("arraytest").catch(swallow);
  }
  beforeAll(cleanup);

  afterAll(async () => {
    await cleanup();
    await destroy();
  });

  it("create schema with json and read and write", async () => {
    await knex.schema.createTable("jsontest", function(table) {
      table.increments("id").notNullable();
      table.json("blocks");
    });
    await knex("jsontest").insert({ blocks: JSON.stringify([1, 2, 3]) });
    const rows = await knex("jsontest").select("blocks");
    expect(rows).toHaveLength(1);
    expect(typeof rows[0].blocks).toBe("object");
  });

  it("create schema with int[][] and write and read it", async () => {
    await knex.schema.createTable("arraytest", function(table) {
      table.increments("id").notNullable();
      table.specificType("grid", "INT[][]");
    });
    await knex("arraytest").insert({
      grid: [
        [1, 1],
        [0, 1]
      ]
    });
    const rows = await knex("arraytest").select("*");
    expect(rows).toHaveLength(1);
    expect(rows[0].grid).toStrictEqual([
      [1, 1],
      [0, 1]
    ]);
  });
});
