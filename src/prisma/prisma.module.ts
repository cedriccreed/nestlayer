import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() makes PrismaService available in every module without re-importing
// PrismaModule. A single shared PrismaClient avoids extra connection pools.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
