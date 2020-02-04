import * as Knex from "knex";

module.exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable("users", function(table) {
    table.increments("id").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
  return knex.schema.createTable("puzzles", function(table) {
    table.increments("id").notNullable();
    table
      .integer("puzzleId")
      .nullable()
      .references("id")
      .inTable("puzzles");
    table
      .integer("userId")
      .nullable()
      .references("id")
      .inTable("users");
    table.jsonb("positionedBlocks").notNullable();
    table.decimal("seconds").nullable();
    table.integer("width").notNullable();
    table.integer("height").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

module.exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTable("puzzles");
  await knex.schema.dropTable("users");
};
