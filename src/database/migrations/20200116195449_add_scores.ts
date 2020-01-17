import * as Knex from "knex";

module.exports.up = (knex: Knex): any => {
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

module.exports.down = (knex: Knex): any => {
  return knex.schema.dropTable("scores");
};
