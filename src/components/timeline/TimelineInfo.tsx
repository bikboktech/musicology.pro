import {
  Box,
  Button,
  Typography,
  useTheme,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  useMediaQuery,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Grid,
  CardContent,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import dayjs, { Dayjs } from "dayjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import Scrollbar from "../custom-scroll/Scrollbar";
import { Dispatch, SetStateAction, useState } from "react";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import { EventWizardProps } from "../../types/eventWizard/EventWizardProps";
import { TimelineData } from "../../types/timeline/TimelineData";
import { useRouter } from "next/router";
import BlankCard from "../shared/BlankCard";
import {
  Alignment,
  ContentAnchor,
  ContentText,
  ContentTocItem,
} from "pdfmake/interfaces";
import PlaylistTrack from "../playlists/PlaylistTrack";
import { TrackInfo } from "../../types/playlist/TrackInfo";

type ContentType = string | { text: string; style?: string };

const generatePDF = (timelineData: TimelineData[], eventName: string) => {
  const docDefinition = {
    content: [
      {
        text: `${eventName} - Timeline`,
        style: "titleStyle",
      },
    ] as ContentType[],
    styles: {
      titleStyle: {
        alignment: "center" as Alignment,
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 30] as [number, number, number, number],
      },
      important: {
        bold: true,
      },
    },
  };

  timelineData.forEach((item) => {
    docDefinition.content.push(
      {
        text: `Time: ${dayjs(item.time).format("YY/MM/DD HH:mm")}`,
        style: "important",
      },
      (item.name ? { text: `Name: ${item.name}` } : {}) as ContentType,
      {
        text: `Track Name: ${item.track.name} - ${item.track.artists}`,
        style: "important",
      },
      (item.instructions
        ? { text: `Instructions: ${item.instructions || ""}` }
        : {}) as ContentType,
      "\n"
    );
  });

  pdfMake.createPdf(docDefinition).open();
};

const TimelineInfo = ({
  values,
  setEdit,
  eventName,
  disabledEditing,
}: {
  values: TimelineData[] | undefined;
  setEdit: Dispatch<SetStateAction<boolean>>;
  eventName?: string;
  disabledEditing: boolean;
}) => {
  const [open, setOpen] = useState<{
    state: boolean;
    timelineCard?: TimelineData;
  }>({
    state: false,
  });
  const [playingTrack, setPlayingTrack] = useState<
    TrackInfo & { audio?: HTMLAudioElement }
  >();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const theme = useTheme();
  const router = useRouter();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = (data?: TimelineData) => {
    if (data) {
      setOpen({
        state: true,
        timelineCard: {
          name: data?.name,
          time: data?.time,
          track: data?.track,
          instructions: data?.instructions,
        },
      });
    }
  };

  const handleClose = () => {
    setOpen({ ...open, state: false });
  };

  if (!values) {
    return <CircularProgress />;
  } else if (!Object.keys(values).length) {
    return (
      <Grid container spacing={3}>
        {/* Edit Details */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={10}>
              <Typography variant="h5" mb={1}>
                Timeline not created
              </Typography>
              <Typography color="textSecondary" mb={3}>
                To create your timeline, click on Edit
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2}>
              {!disabledEditing && (
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <>
        <Grid container spacing={3}>
          {/* Edit Details */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={6}>
                <Typography variant="h5" mb={1}>
                  {`${eventName} Timeline`}
                </Typography>
                <Typography color="textSecondary" mb={3}>
                  To change your timeline, click on Edit
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems={{ sm: "flex-end" }}
                  justifyContent={{ sm: "flex-end" }}
                >
                  {!disabledEditing && (
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
                  )}
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{
                      marginBottom: "8px",
                      maxHeight: "50px",
                    }}
                    onClick={() => generatePDF(values, eventName as string)}
                  >
                    Export PDF
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Stack sx={{ border: "1px solid #FFFFFF", borderRadius: "7px" }}>
              <Scrollbar
                sx={{
                  // height: { lg: "calc(100vh - 300px)", sm: "100vh" },
                  maxHeight: "700px",
                }}
              >
                <Timeline
                  className="theme-timeline"
                  nonce={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                  sx={{
                    p: 0,
                    minHeight: "400px",
                    mb: "-40px",
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.5,
                      paddingLeft: 0,
                    },
                  }}
                >
                  {values?.map((card) => (
                    <TimelineItem>
                      <TimelineOppositeContent
                        sx={{
                          m: "auto 0",
                          display: {
                            xs: "none",
                            sm: "block",
                            md: "block",
                            lg: "block",
                          },
                        }}
                      >
                        {dayjs(card.time).format("DD/MM/YYYY HH:mm")}
                      </TimelineOppositeContent>
                      <TimelineSeparator
                        sx={{
                          paddingLeft: {
                            xs: "10%",
                            sm: "0px",
                            md: "0px",
                            lg: "0px",
                          },
                        }}
                      >
                        <TimelineConnector />
                        <TimelineDot color="primary" variant="outlined" />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Box
                          p={2}
                          sx={{
                            position: "relative",
                            cursor: "pointer",
                            mb: 1,
                            transition: "0.1s ease-in",
                            // transform:
                            //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                            transform: "scale(0.95)",
                            backgroundColor: `primary.light`,
                            maxWidth: "300px",
                          }}
                          onClick={() => handleClickOpen(card)}
                        >
                          <Typography
                            variant="h6"
                            noWrap
                            color={"primary.main"}
                            sx={{
                              paddingBottom: "5px",
                              display: {
                                xs: "block",
                                sm: "none",
                                md: "none",
                                lg: "none",
                              },
                            }}
                          >
                            {dayjs(card.time).format("DD/MM/YYYY HH:mm")}
                          </Typography>
                          <Typography
                            variant="h6"
                            noWrap
                            color={"primary.main"}
                            sx={{ paddingBottom: "5px", width: "100%" }}
                          >
                            {card.name}
                          </Typography>
                          {card.track?.id && (
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="caption">
                                <ListItem
                                  key={card.track.id}
                                  sx={{ paddingLeft: 0 }}
                                >
                                  <ListItemAvatar>
                                    <Avatar src={card.track.imageUrl} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    id={card.track.id}
                                    primary={card.track.name}
                                    secondary={card.track.artists}
                                  />
                                </ListItem>
                              </Typography>
                            </Stack>
                          )}
                          <Typography
                            variant="caption"
                            style={{
                              width: "100%",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {`Instructions: ${card.instructions || "/"}`}
                          </Typography>
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Scrollbar>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "end" }}
              mt={3}
            >
              <Button
                size="large"
                variant="outlined"
                onClick={() => router.push("/events")}
              >
                Back
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Dialog
          fullScreen={fullScreen}
          open={open.state}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          sx={{
            "& .MuiPaper-root": {
              width: "100%",
            },
          }}
        >
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
              <Typography color="textSecondary" mb={3}>
                {open.timelineCard?.name}
              </Typography>
              <CustomFormLabel htmlFor="time">Time</CustomFormLabel>
              <Typography color="textSecondary" mb={3}>
                {open.timelineCard?.time &&
                  (open.timelineCard.time as Dayjs).format("DD/MM/YYYY HH:mm")}
              </Typography>
              {open.timelineCard?.track && (
                <PlaylistTrack
                  track={open.timelineCard?.track}
                  playingTrack={playingTrack}
                  setPlayingTrack={setPlayingTrack}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                />
              )}
              <CustomFormLabel htmlFor="instructions">
                Instructions
              </CustomFormLabel>
              <Typography color="textSecondary" mb={3}>
                {open.timelineCard?.instructions}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
};

export default TimelineInfo;
