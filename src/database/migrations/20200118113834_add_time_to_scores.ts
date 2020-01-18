import * as Knex from "knex";

module.exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.table("scores", function(t) {
    t.decimal("seconds").notNullable();
  });
};

module.exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("scores", function(t) {
    t.dropColumn("seconds");
  });
};
