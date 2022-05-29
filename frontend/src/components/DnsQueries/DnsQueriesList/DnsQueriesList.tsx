import { DnsQueryItem } from "./DnsQueryItem";

type DnsQueriesListProps = {
  queries: DnsQuery[];
};

export function DnsQueriesList(props: DnsQueriesListProps) {
  const { queries } = props;

  return (
    <div className="mt-5">
      {queries.map((query) => (
        <DnsQueryItem key={query._id} query={query} />
      ))}
    </div>
  );
}
