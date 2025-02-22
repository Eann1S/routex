/* eslint-disable */

import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import { Wait } from 'testcontainers';
module.exports = async () => {
  const postgres = await new PostgreSqlContainer('postgres:alpine').start();
  process.env.DB_PORT = postgres.getPort().toString();
  process.env.DB_USER = postgres.getUsername();
  process.env.DB_PASSWORD = postgres.getPassword();
  process.env.DB_NAME = postgres.getDatabase();

  const redis = await new RedisContainer('redis:alpine')
    // .withWaitStrategy(Wait.forLogMessage('Running in standalone mode'))
    .start();
  process.env.CACHE_PORT = redis.getFirstMappedPort().toString();

  global.postgresContainer = postgres;
  global.redisContainer = redis;
};
