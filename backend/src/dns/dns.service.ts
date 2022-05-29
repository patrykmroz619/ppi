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
      { sort: { queryId: -1 } },
    );

    const queryId = (lastQuery?.queryId || 0) + 1;

    const newDnsQuery = new this.dnsQueryModel({
      domain: query.domain,
      to: query.to,
      status: 'SENT',
      queryId,
    });

    const packet = this.createDnsPacket(query.domain, queryId);
    this.socket.send(packet, 0, packet.length, DNS_PORT, query.to, () => null);

    return newDnsQuery.save();
  }

  public async getTheBiggestQueries(limit: number): Promise<DnsQuery[]> {
    return this.dnsQueryModel.find(
      { status: 'WITH_RESPONSE' },
      {},
      { sort: { responseSize: -1 }, limit },
    );
  }

  public async getLastQueries(limit: number): Promise<DnsQuery[]> {
    return this.dnsQueryModel.find({}, {}, { sort: { queryId: -1 }, limit });
  }

  private async handleDnsResponse(message: Buffer, rinfo: dgram.RemoteInfo) {
    const decodedMessage = dns.decode(message) as any;

    console.log(decodedMessage);

    mongoose.connect(process.env.DATABASE_CONNECTION);
    const dnsQueryModel = mongoose.model(DnsQuery.name, DnsQuerySchema);

    let response: object = {
      answers: decodedMessage.answers,
    };

    if (decodedMessage.authorities.length > 0) {
      response = { ...response, authorities: decodedMessage.authorities };
    }

    if (decodedMessage.additionals.length > 0) {
      response = { ...response, additionals: decodedMessage.additionals };
    }

    const status =
      decodedMessage.rcode === 'NOERROR' ? 'WITH_RESPONSE' : 'ERROR';

    await dnsQueryModel.updateOne(
      {
        queryId: decodedMessage.id,
      },
      {
        response:
          status === 'WITH_RESPONSE' ? JSON.stringify(response) : undefined,
        responseSize: rinfo.size,
        status,
      },
    );
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
