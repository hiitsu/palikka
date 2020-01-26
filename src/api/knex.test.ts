import knex, { destroy } from "./knex";

describe("database", () => {
  function swallow() {}
  async function del(table: string) {
    await knex(table)
      .del()
      .catch(swallow);
    await knex.schema.dropTable(table).catch(swallow);
  }
  async function cleanup() {
    await del("jsontest1");
    await del("jsontest2");
    await del("jsontest3");
    await del("arraytest1");
    await del("arraytest2");
    await del("casingtest1");
  }
  beforeAll(cleanup);

  afterAll(async () => {
    await cleanup();
    await destroy();
  });

  it("create schema with json and write with JSON.stringify and read", async () => {
    await knex.schema.createTable("jsontest1", function(table) {
      table.increments("id").notNullable();
      table.json("blocks");
    });
    await knex("jsontest1").insert({ blocks: JSON.stringify([1, 2, 3]) });
    const rows = await knex("jsontest1").select("blocks");
    expect(rows).toHaveLength(1);
    expect(typeof rows[0].blocks).toBe("object");
  });

  it("create schema with json and write without calling JSON.stringify", async () => {
    await knex.schema.createTable("jsontest2", function(table) {
      table.increments("id").notNullable();
      table.jsonb("obj");
      table.json("arr");
    });
    await knex("jsontest2").insert({ obj: { a: 1, b: [1, 2, 3] }, arr: JSON.stringify([{ c: 3 }]) });
    const rows = await knex("jsontest2").select("obj", "arr");
    expect(rows).toHaveLength(1);
    expect(rows[0].obj.a).toBe(1);
    expect(rows[0].obj.b.length).toBe(3);
    expect(rows[0].arr[0].c).toBe(3);
  });

  it("create schema with json nested integer array and write and read it", async () => {
    await knex.schema.createTable("jsontest3", function(table) {
      table.increments("id").notNullable();
      table.jsonb("obj");
      table.json("arr");
    });
    await knex("jsontest3").insert({ obj: { a: 1, b: [1, 2, 3] }, arr: JSON.stringify([{ c: 3 }]) });
    const rows = await knex("jsontest3").select("obj", "arr");
    expect(rows).toHaveLength(1);
    expect(rows[0].obj.a).toBe(1);
    expect(rows[0].obj.b.length).toBe(3);
    expect(rows[0].arr[0].c).toBe(3);
  });

  it("create schema with int[][] and write and read it", async () => {
    await knex.schema.createTable("arraytest1", function(table) {
      table.increments("id").notNullable();
      table.specificType("grid", "INT[][]");
    });
    await knex("arraytest1").insert({
      grid: [
        [1, 1],
        [0, 1]
      ]
    });
    const rows = await knex("arraytest1").select("*");
    expect(rows).toHaveLength(1);
    expect(rows[0].grid).toStrictEqual([
      [1, 1],
      [0, 1]
    ]);
  });

  it("create schema with int[][][] and write and read it", async () => {
    await knex.schema.createTable("arraytest2", function(table) {
      table.increments("id").notNullable();
      table.specificType("blocks", "integer[][][]");
    });
    const blocks = [
      [
        [1, 1],
        [0, 1]
      ],
      [
        [1, 1],
        [0, 1]
      ]
    ];
    await knex("arraytest2").insert({
      blocks
    });
    const rows = await knex("arraytest2").select("*");
    expect(rows).toHaveLength(1);
    expect(rows[0].blocks).toStrictEqual(blocks);
  });

  it("casing test: camelCase", async () => {
    await knex.schema.createTable("casingtest1", function(table) {
      table.increments("id").notNullable();
      table.integer("puzzleId").notNullable();
    });
    await knex("casingtest1").insert({
      puzzleId: 123
    });
    const rows = await knex("casingtest1").select("*");
    expect(rows).toHaveLength(1);
    expect(rows[0].puzzleId).toStrictEqual(123);
  });
});
