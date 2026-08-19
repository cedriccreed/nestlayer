import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// PrismaService is the NestJS wrapper around PrismaClient.
// Extending PrismaClient exposes every generated model API (findMany, create, etc.)
// so other providers can inject this class and query PostgreSQL through Prisma.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // OnModuleInit is a NestJS lifecycle hook: onModuleInit() runs once after
  // this provider has been constructed and the module is ready.
  async onModuleInit(): Promise<void> {
    // $connect() opens the database connection pool at startup instead of
    // waiting for the first query, so connection errors surface immediately.
    await this.$connect();
  }
}
