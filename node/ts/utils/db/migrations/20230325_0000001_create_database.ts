import { Knex } from "knex";
const up = async function (knex: Knex) {
  if (knex.client.config.client == "mysql") {
    await knex.raw("CREATE DATABASE IF NOT EXISTS da");
  }
};
const down = async function (knex: Knex) {
  if (knex.client.config.client == "mysql") {
    await knex.raw("DROP DATABASE IF EXISTS da");
  }
};

export { up, down };
