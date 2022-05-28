import { IsString } from 'class-validator';

export class DnsQueryDto {
  @IsString()
  to: string;

  @IsString()
  domain: string;
}
