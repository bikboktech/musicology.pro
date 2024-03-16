import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  ListItem,
  List,
  Paper,
  useTheme,
} from "@mui/material";

// components
import PlaylistTrack from "./PlaylistTrack";

// images
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { PlaylistInfoData } from "../../types/playlist/PlaylistInfoData";
import { TrackInfo } from "../../types/playlist/TrackInfo";

const PlaylistInfo = ({
  setEdit,
  values,
  isTemplatePlaylist,
}: {
  setEdit: Dispatch<SetStateAction<boolean>>;
  values: PlaylistInfoData | undefined;
  setValues: Dispatch<SetStateAction<PlaylistInfoData | undefined>>;
  isTemplatePlaylist?: boolean;
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [playingTrack, setPlayingTrack] = useState<
    TrackInfo & { audio?: HTMLAudioElement }
  >();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const borderColor = theme.palette.primary.main;

  if (!values) {
    return <CircularProgress />;
  }

  if (!Object.keys(values).length) {
    return (
      <Grid container spacing={3}>
        {/* Edit Details */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={10}>
              <Typography variant="h5" mb={1}>
                Playlist not created
              </Typography>
              <Typography color="textSecondary" mb={3}>
                To create your playlist, click on Edit
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={() => setEdit(true)}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={3}>
        {/* Edit Details */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={6}>
              <Typography variant="h5" mb={1}>
                {values?.name}
              </Typography>
              <Typography color="textSecondary" mb={3}>
                To change your playlist, click on Edit
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ sm: "flex-end" }}
                justifyContent={{ sm: "flex-end" }}
              >
                {loading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      style={{
                        marginRight: "8px",
                        marginBottom: "8px",
                      }}
                      onClick={() => setEdit(true)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Paper
                variant="outlined"
                sx={{ border: `1px solid ${borderColor}` }}
              >
                <List
                  sx={{
                    width: "100%",
                    overflow: "auto",
                  }}
                  dense
                  component="div"
                  role="list"
                >
                  {values?.tracks?.map((track, index) => {
                    const labelId = `transfer-list-all-item-${track.id}-label`;

                    return (
                      <PlaylistTrack
                        track={track}
                        playingTrack={playingTrack}
                        setPlayingTrack={setPlayingTrack}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                      />
                    );
                  })}
                  <ListItem />
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "end" }}
            mt={3}
          >
            <Button
              size="large"
              variant="outlined"
              onClick={() =>
                isTemplatePlaylist
                  ? router.push("/playlists")
                  : router.push("/events")
              }
            >
              Back
            </Button>
          </Stack>
        </Grid>
      </Grid>
    );
  }
};

export default PlaylistInfo;
