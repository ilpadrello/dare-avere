import { config as dotenv } from "dotenv";
import config from "./utils/config";
import knex from "./utils/knex";
import mainMenu from "./lib/cli/menus/main.menu";

dotenv();
console.clear();
(async () => {
  if (config.databases.da) {
    await knex.migrate.latest();
  }
  await mainMenu();
  process.exit(0);
})();
