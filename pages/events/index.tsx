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
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

type Events = {
  data: {
    id: number;
    eventName: string;
    eventType: string;
    client: string;
    eventDate: string;
    artist: string;
    location: string;
  }[];
  count: number;
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Events",
  },
];

const getEvents = async (
  setEvents: Dispatch<SetStateAction<Events | undefined>>,
  params: QueryParams,
  setLoading?: Dispatch<SetStateAction<boolean>>
) => {
  if (setLoading) {
    setLoading(true);
  }

  const queryParams = buildQueryParams(params);

  const events = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events?${queryParams}`
  );

  setEvents(events.data);

  if (setLoading) {
    setLoading(false);
  }
};

const handleDeleteRows = async (
  setEvents: Dispatch<SetStateAction<Events | undefined>>,
  ids: number[],
  setSelected: Dispatch<SetStateAction<number[]>>
) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events`, {
    data: JSON.stringify({
      ids,
    }),
    headers: { "Content-Type": "application/json" },
  });

  setSelected([]);
  await getEvents(setEvents, {});
};
const Events = () => {
  const [events, setEvents] = useState<Events>();
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
      id: "eventName",
      label: "Name",
      sqlColumn: "event_name",
    },
    {
      id: "eventType",
      label: "Type",
      sqlColumn: "event_types.name",
    },
    {
      id: "client",
      label: "Client",
      sqlColumn: "client.full_name",
    },
    {
      id: "eventDate",
      label: "Date",
      sqlColumn: "date",
    },
    {
      id: "artist",
      label: "Artist",
      sqlColumn: "artist.full_name",
    },
    {
      id: "location",
      label: "Location",
      sqlColumn: "location",
    },
  ];

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Events" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <SmartTable
          tableName="Events"
          getData={getEvents}
          handleDeleteRows={handleDeleteRows}
          handleRowClick={(data) => router.push(`/events/${data.id}`)}
          data={events?.data}
          count={events?.count || 0}
          setData={setEvents}
          structureTable={(data) => {
            return data;
          }}
          onCreateClick={() => {
            router.push(`/event-wizard`);
          }}
          columns={columns}
        />
      </Card>
    </PageContainer>
  );
};

export default Events;
