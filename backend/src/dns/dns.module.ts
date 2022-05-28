import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DnsQuery, DnsQuerySchema } from './dns-query.schema';
import { DnsController } from './dns.controller';
import { DnsService } from './dns.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DnsQuery.name, schema: DnsQuerySchema },
    ]),
  ],
  controllers: [DnsController],
  providers: [DnsService],
})
export class DnsModule {}
