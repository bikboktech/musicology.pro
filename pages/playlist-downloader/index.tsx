"use client";
import Link from "next/link";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
// components
import PageContainer from "../../src/components/container/PageContainer";
import PlaylistDownloader from "./PlaylistDownloader";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const PlaylistDownloaderPage = () => {
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

  return (
    <PageContainer>
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh", backgroundColor: "rgb(43,43,43)" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            xl={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={0} sx={{ p: 4, zIndex: 1, width: "100%" }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Image
                  src="/images/logos/musicology-logo.webp"
                  alt="logo"
                  height={155}
                  width={155}
                  priority
                />
              </Box>
              <PlaylistDownloader
                subtext={
                  <Typography
                    variant="h3"
                    textAlign="center"
                    color="textSecondary"
                    mb={1}
                  >
                    Playlist Downloader
                  </Typography>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

PlaylistDownloaderPage.layout = "Blank";
export default PlaylistDownloaderPage;
