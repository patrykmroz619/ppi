import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import dayjs from "dayjs";
import JsonFormatter from "react-json-formatter";

type DnsQueryItemProps = {
  query: DnsQuery;
};

export function DnsQueryItem(props: DnsQueryItemProps) {
  const { query } = props;

  const status = () => {
    if (query.status === "WITH_RESPONSE") {
      return (
        <p className="text-green-500 font-bold text-lg text-right">
          Otrzymano odpowiedź o rozmiarze {query.responseSize}
        </p>
      );
    } else if (query.status === "ERROR") {
      return (
        <p className="text-red-500 font-bold text-lg text-right">
          Serwer odpowiedział błędem
        </p>
      );
    } else if (dayjs(query.createdAt).add(10, "seconds").isAfter(dayjs())) {
      return (
        <p className="text-blue-500 font-bold text-lg text-right">
          Zapytanie zostało wysłane
        </p>
      );
    } else {
      return (
        <p className="text-red-500 font-bold text-lg text-right">
          Nie uzyskano odpowiedzi
        </p>
      );
    }
  };

  return (
    <Accordion key={query._id}>
      <AccordionSummary>
        <div className="flex justify-between w-full">
          <div>
            <p>
              DNS IP: <strong>{query.to}</strong>
            </p>
            <p>
              Domena: <strong>{query.domain}</strong>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 text-right font-bold">
              {new Date(query.createdAt).toLocaleDateString()}{" "}
              {new Date(query.createdAt).toLocaleTimeString()}
            </p>
            {status()}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {query?.response ? (
          <JsonFormatter
            json={query.response}
            tabWith={4}
            jsonStyle={{
              propertyStyle: { color: "red" },
              stringStyle: { color: "blue" },
              numberStyle: { color: "darkorange" },
            }}
          />
        ) : (
          <p className="text-center font-bold my-3">Brak odpowiedzi</p>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
