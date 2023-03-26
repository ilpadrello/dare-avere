import Knex from "knex";
import config from "./config";

const knex = Knex(config.databases.da);

export default knex;
