import { Card, CircularProgress } from "@mui/material";

import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../src/components/container/PageContainer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SmartTable from "../../src/components/smart-table";
import { HeadCell } from "../../src/components/smart-table/EnhancedTableHead";
import axios from "../../src/utils/axios";
import buildQueryParams, {
  QueryParams,
} from "../../src/components/smart-table/utils/buildQueryParams";
import { useRouter } from "next/router";
import { IconCircleCheck, IconXboxX } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";

type QuoteData = {
  id: number;
  clientName: string;
  eventDate: string;
  location: string;
  budget: string;
  approved: boolean;
};

type Quotes = {
  data: QuoteData[];
  count: number;
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Quotes",
  },
];

const getQuotes = async (
  setQuotes: Dispatch<SetStateAction<Quotes | undefined>>,
  params: QueryParams
) => {
  const queryParams = buildQueryParams(params);

  const quotes = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes?${queryParams}`
  );

  setQuotes(quotes.data);
};

const handleDeleteRows = async (
  setQuotes: Dispatch<SetStateAction<Quotes | undefined>>,
  ids: number[],
  setSelected: Dispatch<SetStateAction<number[]>>
) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes`, {
    data: JSON.stringify({
      ids,
    }),
    headers: { "Content-Type": "application/json" },
  });

  setSelected([]);
  await getQuotes(setQuotes, {});
};
const Quotes = () => {
  const [quotes, setQuotes] = useState<Quotes>();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const columns: HeadCell[] = [
    {
      id: "clientName",
      label: "Client Name",
      sqlColumn: "artists.full_name",
    },
    {
      id: "eventDate",
      label: "Event Date",
      sqlColumn: "event_date",
    },
    {
      id: "location",
      label: "Location",
      sqlColumn: "event_location",
    },
    {
      id: "budget",
      label: "Budget",
      sqlColumn: "event_budget",
    },
    {
      id: "approved",
      label: "Approved",
      sqlColumn: "approved",
    },
  ];

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Quotes" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <SmartTable
          tableName="Quotes"
          getData={getQuotes}
          handleDeleteRows={handleDeleteRows}
          handleRowClick={(data) => router.push(`/quotes/${data.id}`)}
          data={quotes?.data}
          count={quotes?.count || 0}
          setData={setQuotes}
          structureTable={(data) => {
            return data.map((quoteData) => ({
              ...quoteData,
              approved: quoteData.approved ? (
                <IconCircleCheck style={{ marginLeft: "25%" }} />
              ) : (
                <IconXboxX style={{ marginLeft: "25%" }} />
              ),
            }));
          }}
          columns={columns}
        />
      </Card>
    </PageContainer>
  );
};

export default Quotes;
