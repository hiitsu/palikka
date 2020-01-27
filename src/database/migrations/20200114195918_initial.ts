import * as Knex from "knex";

module.exports.up = (knex: Knex): any => {
  return knex.schema.createTable("puzzles", function(table) {
    table.increments("id").notNullable();
    table.jsonb("blocks").notNullable();
    table.integer("width").notNullable();
    table.integer("height").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

module.exports.down = (knex: Knex): any => {
  return knex.schema.dropTable("puzzles");
};
