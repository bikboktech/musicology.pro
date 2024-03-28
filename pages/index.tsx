import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import axios from "../src/utils/axios";
import { IconXboxX, IconCircleCheck } from "@tabler/icons-react";

type Events = {
  id: number;
  eventName: string;
  eventType: string;
  client: string;
  eventDate: string;
  artist: string;
  location: string;
  hasPlaylist: boolean;
  hasTimeline: boolean;
  signedContract: boolean;
}[];

const getEvents = async (
  setEvents: Dispatch<SetStateAction<Events | undefined>>
) => {
  const events = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/upcoming`
  );

  setEvents(events.data ?? []);
};

const Modern = () => {
  const [events, setEvents] = useState<Events>();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user && !events) {
      getEvents(setEvents);
    }
  }, [user, events]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Box>
        <Card
          elevation={0}
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.light,
            py: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: "30px" }}>
            <Grid container spacing={3} justifyContent="space-between">
              <Grid item sm={9} display="flex" alignItems="center">
                <Box
                  sx={{
                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
                >
                  <Typography variant="h5">{`Welcome to Musicology.pro, ${user?.fullName}!`}</Typography>
                  <Typography variant="subtitle1" color="textSecondary" my={2}>
                    Your ultimate platform for creating and discovering
                    unforgettable music events. With our easy-to-use event
                    creation tools, bringing your musical gatherings to life has
                    never been easier
                  </Typography>
                  <Button variant="outlined" color="primary">
                    Create an Event
                  </Button>
                </Box>
              </Grid>
              <Grid item sm={3}>
                <Box
                  mb="-250px"
                  sx={{
                    float: "right",
                    display: { xs: "none", md: "flex", lg: "flex" },
                  }}
                >
                  <img src={"/images/logos/musicology-logo.webp"} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Box p={3} px={2}>
        <Typography variant="h4" mb={0} mt={4} pl={1}>
          Upcoming Events:
        </Typography>
      </Box>
      <Box>
        {events ? (
          events.length ? (
            events.map((event) => {
              const eventCompleted =
                ((1 +
                  +event.hasPlaylist +
                  +event.hasTimeline +
                  +event.signedContract) /
                  4) *
                100;
              return (
                <Box key={event.id} px={2}>
                  <Box
                    p={2}
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      mb: 1,
                      transition: "0.1s ease-in",
                      backgroundColor: (theme) => theme.palette.secondary.light,
                      border: "2px solid white",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid
                        item
                        sm={7}
                        display="flex"
                        alignItems="left"
                        flexDirection="column"
                      >
                        <Typography variant="h5" noWrap>
                          {event.eventName}
                        </Typography>
                        <Stack
                          direction="column"
                          alignItems="left"
                          sx={{ pt: "10px" }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.85rem" }}
                          >{`Type: ${event.eventType}`}</Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.85rem" }}
                          >{`Date: ${event.eventDate}`}</Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.85rem" }}
                          >{`Client: ${event.client}`}</Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.85rem" }}
                          >{`Client: ${event.artist}`}</Typography>
                        </Stack>
                        <Typography variant="h6" sx={{ pt: "20px" }} noWrap>
                          {`Event completed: ${eventCompleted.toFixed(2)} %`}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sm={5}
                        display="flex"
                        alignItems="right"
                        flexDirection="row"
                        justifyContent="flex-end"
                        pt={0}
                        sx={{
                          display: {
                            xs: "none",
                            sm: "flex",
                            md: "flex",
                            lg: "flex",
                          },
                        }}
                      >
                        <Stack
                          direction="column"
                          alignItems="end"
                          justifyContent="space-around"
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            my={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              Playlist
                            </Typography>{" "}
                            <div>
                              {event.hasPlaylist ? (
                                <IconCircleCheck />
                              ) : (
                                <IconXboxX />
                              )}
                            </div>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            my={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              Timeline
                            </Typography>
                            <div>
                              {event.hasTimeline ? (
                                <IconCircleCheck />
                              ) : (
                                <IconXboxX />
                              )}
                            </div>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            my={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              Contract
                            </Typography>
                            <div>
                              {event.signedContract ? (
                                <IconCircleCheck />
                              ) : (
                                <IconXboxX />
                              )}
                            </div>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box ml={2}>
              <Alert
                severity="info"
                variant="outlined"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderColor: "white",
                  color: "white",
                }}
              >
                No Events Found!
              </Alert>
            </Box>
          )
        ) : (
          <CircularProgress />
        )}
      </Box>
    </PageContainer>
  );
};

export default Modern;
