import * as Knex from "knex";

module.exports.up = (knex: Knex): any => {
  return knex.schema.createTable("users", function(table) {
    table.increments("id").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

module.exports.down = (knex: Knex): any => {
  return knex.schema.dropTable("users");
};
