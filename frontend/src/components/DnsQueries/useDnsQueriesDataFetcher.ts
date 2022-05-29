import { SyntheticEvent, useEffect, useState } from "react";
import { restAPI } from "../../api";

type QueryType = "LAST" | "BIGGEST";

export function useDnsQueriesDataFetcher() {
  const [queries, setQueries] = useState<DnsQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryType, setQueryType] = useState<QueryType>("LAST");
  const [limit] = useState(20);

  const changeQueryType = (event: SyntheticEvent, newQueryType: QueryType) => {
    setQueryType(newQueryType);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url =
          queryType === "LAST"
            ? "/dns/last-queries"
            : "/dns/the-biggest-queries";

        const response = await restAPI.get<DnsQuery[]>(url + `?limit=${limit}`);

        setQueries(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, [queryType, limit]);

  return {
    queries,
    loading,
    queryType,
    changeQueryType,
    limit,
  };
}
