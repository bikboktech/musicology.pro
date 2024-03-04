import * as React from "react";
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import { Box, CardContent, CircularProgress } from "@mui/material";

// components
import { EventInfoData } from "../../src/types/events/EventInfoData";
import axios from "../../src/utils/axios";
import { useRouter } from "next/router";
import { PlaylistInfoData } from "../../src/types/playlist/PlaylistInfoData";
import PlaylistEdit from "../../src/components/playlists/PlaylistEdit";
import PlaylistInfo from "../../src/components/playlists/PlaylistInfo";
import { useAuth } from "../../context/AuthContext";
import BlankCard from "../../src/components/shared/BlankCard";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Playlists",
  },
];

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
  const router = useRouter();
  const [edit, setEdit] = React.useState(
    Boolean(router.query.playlistId === "new")
  );
  const [playlistInfo, setPlaylistInfo] = React.useState<PlaylistInfoData>();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  React.useEffect(() => {
    if (
      user &&
      !playlistInfo &&
      router.query.playlistId &&
      router.query.playlistId !== "new"
    ) {
      getPlaylist(router.query.playlistId as string, setPlaylistInfo);
    }
  }, [user, playlistInfo, router.query.playlistId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Playlists" items={BCrumb} />
      {/* end breadcrumb */}
      <BlankCard>
        <CardContent>
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
              isTemplatePlaylist={true}
            />
          )}
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default TemplatePlaylist;
