/* eslint-disable */

import { PostgreSqlContainer } from '@testcontainers/postgresql';

module.exports = async () => {
  const postgres = await new PostgreSqlContainer('postgres:alpine').start();
  process.env.DB_PORT = postgres.getPort().toString();
  process.env.DB_USER = postgres.getUsername();
  process.env.DB_PASSWORD = postgres.getPassword();
  process.env.DB_NAME = postgres.getDatabase();

  global.postgresContainer = postgres;
};
