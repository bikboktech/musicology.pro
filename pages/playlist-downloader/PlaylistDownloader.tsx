import React, { useState } from "react";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";

import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import ErrorSnackbar from "../../src/components/error/ErrorSnackbar";
import downloadPlaylist from "../../src/utils/downloadPlaylist";

interface downloaderType {
  title?: string;
  subtext?: JSX.Element | JSX.Element[];
}

const PlaylistDownloader = ({ title, subtext }: downloaderType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      spotifyLink: "",
    },
    validationSchema: yup.object({
      spotifyLink: yup.string().required("Spotify Link is required"),
    }),
    onSubmit: async (data) => {
      setLoading(true);
      try {
        await downloadPlaylist(data.spotifyLink);

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err.response.data);
      }
    },
  });

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={formik.handleSubmit}>
        <Box my={2}>
          <CustomTextField
            id="spotifyLink"
            variant="outlined"
            name="spotifyLink"
            label="Spotify Playlist Link"
            placeholder="ex. https://open.spotify.com/playlist/0S3oyFxQ3iglOGVxFTF79K?si=ea7e596097014917"
            value={formik.values.spotifyLink}
            onChange={formik.handleChange}
            error={
              formik.touched.spotifyLink && Boolean(formik.errors.spotifyLink)
            }
            helperText={formik.touched.spotifyLink && formik.errors.spotifyLink}
            fullWidth
          />
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
        <ErrorSnackbar error={error} setError={setError} />
      </form>
    </>
  );
};

export default PlaylistDownloader;
