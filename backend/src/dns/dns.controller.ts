import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DnsService } from './dns.service';
import { DnsQueryDto } from './dto/dns.dto';

@Controller('dns')
export class DnsController {
  constructor(private dnsService: DnsService) {}

  @Get('the-biggest-queries')
  async getTheBiggestQueries(@Query('limit') limit: number) {
    return this.dnsService.getTheBiggestQueries(limit);
  }

  @Get('last-queries')
  async getLastQueries(@Query('limit') limit: number) {
    return this.dnsService.getLastQueries(limit);
  }

  @Post('execute-query')
  async executeQuery(@Body() dnsQueryDto: DnsQueryDto) {
    return this.dnsService.executeDnsQuery(dnsQueryDto);
  }
}
