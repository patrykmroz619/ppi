import { Module } from '@nestjs/common';
import { NtpController } from './ntp.controller';

@Module({
  controllers: [NtpController],
})
export class NtpModule {}
