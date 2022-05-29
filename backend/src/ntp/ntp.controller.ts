import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import * as ntpTime from 'ntp-time';

@Controller('ntp')
export class NtpController {
  @Get('time')
  public async getTime(@Query('to') to: string): Promise<ntpTime.NTPPacket> {
    const client = new ntpTime.Client(to, 123, { timeout: 5000 });

    try {
      return await client.syncTime();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
