import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { DnsQueryStatus } from './dns.interface';

export type DnsQueryDocument = mongoose.Document & DnsQuery;

@Schema()
export class DnsQuery {
  @Prop({ required: true })
  queryId: number;

  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  to: string;

  @Prop()
  response: string | null;

  @Prop()
  responseSize: number | null;

  @Prop({ required: true })
  status: DnsQueryStatus;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const DnsQuerySchema = SchemaFactory.createForClass(DnsQuery);
