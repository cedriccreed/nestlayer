import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load .env before we read DATABASE_URL. Prisma 7 no longer embeds the
// connection string in schema.prisma, so the adapter needs it from env.
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required to create the Prisma driver adapter',
  );
}

// Prisma 7's client engine is JavaScript (no Rust query-engine binary for
// direct connections). A driver adapter bridges Prisma's query plan to a
// real Node driver — here PrismaPg wraps `pg` so SQL hits PostgreSQL.
const adapter = new PrismaPg({ connectionString });

// PrismaService is the NestJS wrapper around PrismaClient.
// Extending PrismaClient exposes every generated model API (findMany, create, etc.)
// so other providers can inject this class and query PostgreSQL through Prisma.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Equivalent to `new PrismaClient({ adapter })`: Nest instantiates this
    // class, and super() forwards the adapter Prisma 7 requires at construct time.
    super({ adapter });
  }

  // OnModuleInit is a NestJS lifecycle hook: onModuleInit() runs once after
  // this provider has been constructed and the module is ready.
  async onModuleInit(): Promise<void> {
    // $connect() opens the database connection pool at startup instead of
    // waiting for the first query, so connection errors surface immediately.
    await this.$connect();
  }
}
