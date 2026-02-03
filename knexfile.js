const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const {
  DATABASE_URL,
  DB_HOST = '127.0.0.1',
  DB_PORT = 5432,
  DB_NAME = 'stackoverstay',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
} = process.env;

const baseConfig = {
  client: 'pg',
  connection: DATABASE_URL || {
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeders'),
  },
};

module.exports = {
  development: baseConfig,
  test: {
    ...baseConfig,
    connection: DATABASE_URL || {
      host: process.env.TEST_DB_HOST || DB_HOST,
      port: Number(process.env.TEST_DB_PORT || DB_PORT),
      database: process.env.TEST_DB_NAME || `${DB_NAME}_test`,
      user: process.env.TEST_DB_USER || DB_USER,
      password: process.env.TEST_DB_PASSWORD || DB_PASSWORD,
    },
  },
  production: {
    ...baseConfig,
    pool: {
      min: 2,
      max: 20,
    },
  },
};