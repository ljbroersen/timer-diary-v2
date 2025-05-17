import dotenv from "dotenv";

dotenv.config({ path: "./server/.env.local" });

export const development = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "default_db",
    user: process.env.DB_USER || "default_user",
    password: process.env.DB_PASSWORD || "default_password",
  },
};

export const production = {
  client: "postgresql",
  connection: {
    database: process.env.DB_NAME || "my_db",
    user: process.env.DB_USER || "username",
    password: process.env.DB_PASSWORD || "password",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
