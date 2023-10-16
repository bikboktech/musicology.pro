import * as React from "react";
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import { Box } from "@mui/material";

// components
import { EventInfoData } from "../../src/types/events/EventInfoData";
import axios from "axios";
import { useRouter } from "next/router";
import { PlaylistInfoData } from "../../src/types/playlist/PlaylistInfoData";
import PlaylistEdit from "../../src/components/playlists/PlaylistEdit";
import PlaylistInfo from "../../src/components/playlists/PlaylistInfo";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Playlists",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const getPlaylist = async (
  playlistId: string,
  setPlaylistInfo: React.Dispatch<
    React.SetStateAction<PlaylistInfoData | undefined>
  >
) => {
  const playlist = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/template-playlists/${playlistId}`
  );

  setPlaylistInfo(playlist.data);
};

const TemplatePlaylist = () => {
  const [value, setValue] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [eventInfo, setEventInfo] = React.useState<EventInfoData>();
  const [playlistInfo, setPlaylistInfo] = React.useState<PlaylistInfoData>();
  const router = useRouter();

  React.useEffect(() => {
    if (
      !playlistInfo &&
      router.query.playlistId &&
      router.query.playlistId !== "new"
    ) {
      console.log("tu san");
      getPlaylist(router.query.playlistId as string, setPlaylistInfo);
    } else if (router.query.playlistId && router.query.playlistId === "new") {
      setEdit(true);
    }
  }, [playlistInfo, router.query.playlistId]);

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Playlists" items={BCrumb} />
      {/* end breadcrumb */}

      {edit ? (
        <PlaylistEdit
          values={playlistInfo}
          setValues={setPlaylistInfo}
          setEdit={setEdit}
          isTemplatePlaylist={true}
        />
      ) : (
        <PlaylistInfo
          setEdit={setEdit}
          values={playlistInfo}
          setValues={setPlaylistInfo}
        />
      )}
    </PageContainer>
  );
};

export default TemplatePlaylist;
