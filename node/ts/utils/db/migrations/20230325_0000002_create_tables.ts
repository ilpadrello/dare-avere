/**
 *
 */
import { Knex } from "knex";
const up = async function (knex: Knex) {
  await knex.schema.createTable("payers", (table) => {
    table.string("id").primary().notNullable();
    table.string("name").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
  await knex.schema.createTable("categories", (table) => {
    table.string("id").primary().notNullable();
    table.string("name").notNullable().unique();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.boolean("show").notNullable().defaultTo(true);
  });
  await knex.schema.createTable("transactions", (table) => {
    table.string("id").primary().notNullable();
    table.string("description").notNullable();
    table.float("amount").notNullable();
    table.timestamp("date").notNullable();
    table.string("payer_id").notNullable();
    table.string("category_id").notNullable();
    table.float("percent").notNullable().defaultTo(50);
    table.string("comment").nullable();

    table.foreign("payer_id").references("payers.id").onDelete("RESTRICT");
    table
      .foreign("category_id")
      .references("categories.id")
      .onDelete("RESTRICT");
  });
};
const down = async function (knex: Knex) {
  await knex.schema.dropTable("transactions");
  await knex.schema.dropTable("payers");
};

export { up, down };
