import knex from "knex";
import * as config from "../knexfile.js";

const db = knex(config.development);

export default db;
