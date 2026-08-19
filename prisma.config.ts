import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@prisma/config';

// Load .env before any process.env.DATABASE_URL access. Prisma 7 no longer
// reads the connection string from schema.prisma, so the CLI only sees the
// URL we pass here. dotenv must run first or url would be undefined.
loadEnv({ path: resolve(process.cwd(), '.env') });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing. Set it in the project .env file.');
}

// Prisma 7 splits CLI connection config from the data model.
// schema.prisma stays portable and secret-free; this file supplies the
// environment-specific URL so migrate/generate can reach PostgreSQL.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
