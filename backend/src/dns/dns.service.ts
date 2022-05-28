import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as dgram from 'dgram';
import * as dns from 'dns-packet';
import mongoose, { Connection, Model } from 'mongoose';
import { DnsQuery, DnsQueryDocument, DnsQuerySchema } from './dns-query.schema';
import { DnsQueryDto } from './dto/dns.dto';

const DNS_PORT = 53;

@Injectable()
export class DnsService {
  private socket: dgram.Socket;

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(DnsQuery.name) private dnsQueryModel: Model<DnsQueryDocument>,
  ) {
    this.socket = dgram.createSocket('udp4');

    this.socket.on('message', this.handleDnsResponse);
  }

  public async executeDnsQuery(query: DnsQueryDto): Promise<DnsQuery> {
    const lastQuery = await this.dnsQueryModel.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    );

    const queryId = (lastQuery?.queryId || 0) + 1;

    const newDnsQuery = new this.dnsQueryModel({
      domain: query.domain,
      to: query.to,
      status: 'SENT',
      queryId,
    });

    const packet = this.createDnsPacket(query.domain, queryId);
    this.socket.send(packet, 0, packet.length, DNS_PORT, query.to);

    return newDnsQuery.save();
  }

  public async getTheBiggestQueries(): Promise<DnsQuery[]> {
    return this.dnsQueryModel.find(
      { status: 'WITH_RESPONSE' },
      {},
      { sort: { responseSize: -1 }, limit: 100 },
    );
  }

  private async handleDnsResponse(message: Buffer, rinfo: dgram.RemoteInfo) {
    const decodedMessage = dns.decode(message);

    mongoose.connect(process.env.DATABASE_CONNECTION);
    const dnsQueryModel = mongoose.model(DnsQuery.name, DnsQuerySchema);

    await dnsQueryModel.updateOne(
      {
        queryId: decodedMessage.id,
      },
      {
        response: JSON.stringify(decodedMessage.answers),
        responseSize: rinfo.size,
        status: 'WITH_RESPONSE',
      },
    );
    await mongoose.disconnect();
  }

  private createDnsPacket(domain: string, queryId: number): Buffer {
    return dns.encode({
      type: 'query',
      id: queryId,
      questions: [
        {
          type: 'A',
          name: domain,
        },
        {
          type: 'TXT',
          name: domain,
        },
      ],
    });
  }
}
