declare type DnsQuery = {
  _id: string;
  queryId: number;
  domain: string;
  to: string;
  status: "SENT" | "WITH_RESPONSE" | "ERROR";
  responseSize?: number;
  response?: string;
  createdAt: string;
};
