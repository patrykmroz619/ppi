import { Body, Controller, Get, Post } from '@nestjs/common';
import { DnsService } from './dns.service';
import { DnsQueryDto } from './dto/dns.dto';

@Controller('dns')
export class DnsController {
  constructor(private dnsService: DnsService) {}

  @Get('the-biggest-queries')
  async executeDnsQuery() {
    return this.dnsService.getTheBiggestQueries();
  }

  @Post('execute-query')
  async executeQuery(@Body() dnsQueryDto: DnsQueryDto) {
    return this.dnsService.executeDnsQuery(dnsQueryDto);
  }
}
