import * as Knex from "knex";

module.exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable("users", function(table) {
    table.increments("id").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
  return knex.schema.createTable("solutions", function(table) {
    table.increments("id").notNullable();
    table
      .integer("puzzleId")
      .notNullable()
      .references("id")
      .inTable("puzzles");
    table
      .integer("userId")
      .nullable()
      .references("id")
      .inTable("users");
    table.jsonb("blocks").notNullable();
    table.decimal("seconds").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

module.exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTable("solutions");
  await knex.schema.dropTable("users");
};
