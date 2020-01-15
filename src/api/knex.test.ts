import knex, { destroy } from "./knex";

describe("database", () => {
  beforeAll(async () => {
    await knex("puzzles").del();
  });

  afterAll(async () => {
    await knex("puzzles").del();
    await destroy();
  });

  it("read and write", async () => {
    await knex("puzzles").insert({ blocks: JSON.stringify([1, 2, 3]) });
    const rows = await knex("puzzles").select("blocks");
    expect(rows).toBeDefined();
    expect(rows).toHaveLength(1);
  });
});
