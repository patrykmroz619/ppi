import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DnsModule } from './dns/dns.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NtpModule } from './ntp/ntp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DnsModule,
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    NtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
