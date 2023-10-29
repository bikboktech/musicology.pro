import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Autocomplete,
  Paper,
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
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { useFormik } from "formik";
import dayjs, { Dayjs } from "dayjs";

import Scrollbar from "../custom-scroll/Scrollbar";
import { Dispatch, SetStateAction, useState } from "react";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import buildQueryParams, {
  QueryParams,
} from "../smart-table/utils/buildQueryParams";
import { TrackInfo } from "../../types/playlist/TrackInfo";
import axios from "axios";
import { EventWizardProps } from "../../types/eventWizard/EventWizardProps";
import { TimelineData } from "../../types/timeline/TimelineData";
import { useRouter } from "next/router";
import BlankCard from "../shared/BlankCard";

const TimelineInfo = ({
  wizardProps,
  values,
  setValues,
  setEdit,
  eventName,
}: {
  wizardProps?: EventWizardProps;
  values: TimelineData[] | undefined;
  setValues: Dispatch<SetStateAction<TimelineData[] | undefined>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
  eventName?: string;
}) => {
  const [open, setOpen] = useState<{
    state: boolean;
    timelineCard?: TimelineData;
  }>({
    state: false,
  });
  const theme = useTheme();
  const router = useRouter();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [tracks, setTracks] = useState<TrackInfo[]>([]);
  const [timeline, setTimeline] = useState<TimelineData[]>();
  const [error, setError] = useState<string | null>(null);

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
          <BlankCard>
            <CardContent>
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
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <>
        <Grid container spacing={3}>
          {/* Edit Details */}
          <Grid item xs={12}>
            <BlankCard>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={8} sm={10}>
                    <Typography variant="h5" mb={1}>
                      {`${eventName} Timeline`}
                    </Typography>
                    <Typography color="textSecondary" mb={3}>
                      To change your timeline, click on Edit
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
                <Stack
                  sx={{ border: "1px solid #FFFFFF", borderRadius: "7px" }}
                >
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
                          <TimelineOppositeContent sx={{ m: "auto 0" }}>
                            {dayjs(card.time).format("YY/MM/DD HH:mm")}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
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
                                sx={{ paddingBottom: "5px" }}
                              >
                                {card.name}
                              </Typography>
                              {card.track && (
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
                              <Typography variant="caption">
                                {`Instructions: ${card.instructions}`}
                              </Typography>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </Scrollbar>
                </Stack>
              </CardContent>
            </BlankCard>
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
                  (open.timelineCard.time as Dayjs).format("YYYY MM DD HH:MM")}
              </Typography>
              {open.timelineCard?.track && (
                <a
                  href={open.timelineCard?.track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CustomFormLabel htmlFor="playlistName">Song</CustomFormLabel>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={open.timelineCard?.track.imageUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      id={open.timelineCard?.track.id}
                      primary={open.timelineCard?.track.name}
                      secondary={open.timelineCard?.track.artists}
                    />
                  </ListItem>
                </a>
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
