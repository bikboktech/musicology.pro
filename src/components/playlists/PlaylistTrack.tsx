import { Pause, PlayArrow } from "@mui/icons-material";
import {
  Avatar,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TrackInfo } from "../../types/playlist/TrackInfo";
import { Box } from "@mui/system";

type Track = TrackInfo & {
  audio?: HTMLAudioElement;
};

const PlaylistTrack = ({
  track,
  playingTrack,
  setPlayingTrack,
  isPlaying,
  setIsPlaying,
}: {
  track: Track;
  playingTrack: Track | undefined;
  setPlayingTrack: Dispatch<SetStateAction<Track | undefined>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    return () => {
      if (playingTrack && playingTrack.audio) {
        playingTrack.audio.pause();
      }
    };
  }, [playingTrack]);

  const handlePlayPause = (track: Track) => {
    if (track.url) {
      if (playingTrack && playingTrack.id === track.id && isPlaying) {
        playingTrack.audio?.pause();
        setIsPlaying(false);
      } else {
        if (playingTrack && playingTrack.id !== track.id) {
          playingTrack.audio?.pause();
        }
        const audio = new Audio(track.url);
        setPlayingTrack({ ...track, audio });
        audio.play();
        setIsPlaying(true);
        audio.addEventListener("ended", () => setIsPlaying(false));
      }
    }
  };

  return (
    <ListItem
      key={track.id}
      sx={{ cursor: track.url ? "pointer" : "default", width: "100%" }}
      onClick={(e) => {
        e.stopPropagation();

        handlePlayPause(track);
      }}
    >
      <ListItemAvatar>
        <Box position="relative">
          <Avatar src={track.imageUrl} />
          {track.url && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            >
              <IconButton
                size="small"
                style={{ backgroundColor: "transparent" }}
              >
                {playingTrack?.id === track.id && isPlaying ? (
                  <Pause />
                ) : (
                  <PlayArrow />
                )}
              </IconButton>
            </Box>
          )}
        </Box>
      </ListItemAvatar>
      <ListItemText primary={track.name} secondary={track.artists} />
      {playingTrack && playingTrack.id === track.id && isPlaying && (
        <CircularProgress size={24} />
      )}
    </ListItem>
  );
};

export default PlaylistTrack;
