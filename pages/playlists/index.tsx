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

type Playlists = {
  data: {
    id: number;
    playlistName: string;
    eventType: string;
  }[];
  count: number;
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Playlists",
  },
];

const getTemplatePlaylists = async (
  setPlaylists: Dispatch<SetStateAction<Playlists | undefined>>,
  params: QueryParams,
  setLoading?: Dispatch<SetStateAction<boolean>>
) => {
  if (setLoading) {
    setLoading(true);
  }

  const queryParams = buildQueryParams(params);

  const playlists = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists?${queryParams}`
  );

  setPlaylists(playlists.data);

  if (setLoading) {
    setLoading(false);
  }
};

const handleDeleteRows = async (
  setPlaylists: Dispatch<SetStateAction<Playlists | undefined>>,
  ids: number[],
  setSelected: Dispatch<SetStateAction<number[]>>
) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists`,
    {
      data: JSON.stringify({
        ids,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  setSelected([]);
  await getTemplatePlaylists(setPlaylists, {});
};

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlists>();
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
      id: "playlistName",
      label: "Name",
      sqlColumn: "name",
    },
    {
      id: "eventType",
      label: "Type",
      sqlColumn: "event_types.name",
    },
  ];

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Playlists" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <SmartTable
          tableName="Playlists"
          getData={getTemplatePlaylists}
          handleDeleteRows={handleDeleteRows}
          handleRowClick={(data) => {
            router.push(`/playlists/${data.id}`);
          }}
          onCreateClick={() => {
            router.push(`/playlists/new`);
          }}
          data={playlists?.data}
          count={playlists?.count || 0}
          setData={setPlaylists}
          structureTable={(data) =>
            data.map((playlist) => ({
              ...playlist,
              eventType: playlist.eventType.name,
            }))
          }
          columns={columns}
        />
      </Card>
    </PageContainer>
  );
};

export default Playlists;
