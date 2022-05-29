import { CircularProgress, Divider, Tab, Tabs } from "@mui/material";
import { DnsQueriesList } from "./DnsQueriesList/DnsQueriesList";
import { useDnsQueriesDataFetcher } from "./useDnsQueriesDataFetcher";

export function DnsQueries() {
  const { changeQueryType, queryType, queries, loading } =
    useDnsQueriesDataFetcher();

  return (
    <div className="container">
      <div className="flex flex-col sm:flex-row  justify-between">
        <h2 className="text-2xl font-bold mb-3">Historia zapytań DNS</h2>
        <Tabs value={queryType} onChange={changeQueryType}>
          <Tab value="LAST" label="Ostatnie" />
          <Tab value="BIGGEST" label="Największe odpowiedzi" />
        </Tabs>
      </div>
      <Divider />
      <DnsQueriesList queries={queries} />
      {!queries.length && loading && (
        <div className="flex justify-center items-center h-96">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
