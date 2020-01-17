import * as Knex from "knex";

module.exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable("users", function(table) {
    table.increments("id").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  return knex.schema.createTable("scores", function(table) {
    table.increments("id").notNullable();
    table
      .integer("puzzle_id")
      .notNullable()
      .references("id")
      .inTable("puzzles");
    table.jsonb("blocks").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

module.exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTable("scores");
  await knex.schema.dropTable("users");
};
