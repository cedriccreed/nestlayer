import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

// UsersModule owns user lookups so AuthModule does not talk to Prisma for
// every read. Exporting UsersService lets Auth (and later profile modules)
// inject it without duplicating queries.
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
