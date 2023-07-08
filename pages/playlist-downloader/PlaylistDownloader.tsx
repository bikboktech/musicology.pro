import React, { useState } from "react";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";
import axios from "axios";

import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";

interface downloaderType {
  title?: string;
  subtext?: JSX.Element | JSX.Element[];
}

const PlaylistDownloader = ({ title, subtext }: downloaderType) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    try {
      const response = (await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist-management/download`,
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlistLink: data.spotifyPlaylistLink }),
        }
      )) as Response;

      const contentDisposition = response.headers.get("Content-Disposition");

      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "playlist.zip";

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a") as HTMLAnchorElement;
      link.href = downloadUrl;
      link.setAttribute("download", filename);

      document.body.appendChild(link);

      link.click();

      link.parentNode?.removeChild(link);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error downloading playlist:", error);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my={2}>
          <Controller
            name="spotifyPlaylistLink"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                variant="outlined"
                label="Spotify Playlist Link"
                placeholder="ex. https://open.spotify.com/playlist/0S3oyFxQ3iglOGVxFTF79K?si=ea7e596097014917"
                fullWidth
              />
            )}
          />

          {errors.spotifyPlaylistLink && <span>This field is required</span>}
        </Box>
        <Box>
          {loading ? (
            <LinearProgress
              sx={{
                backgroundColor: "transparent",
              }}
            />
          ) : (
            <Button
              color="primary"
              variant="outlined"
              size="large"
              fullWidth
              type="submit"
            >
              Download
            </Button>
          )}
        </Box>
      </form>
    </>
  );
};

export default PlaylistDownloader;
