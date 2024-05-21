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
  FormControlLabel,
  RadioGroup,
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
import dayjs from "dayjs";

import Scrollbar from "../custom-scroll/Scrollbar";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import buildQueryParams, {
  QueryParams,
} from "../smart-table/utils/buildQueryParams";
import { TrackInfo } from "../../types/playlist/TrackInfo";
import axios from "../../utils/axios";
import { EventWizardProps } from "../../types/eventWizard/EventWizardProps";
import { TimelineData } from "../../types/timeline/TimelineData";
import { PlaylistInfoData } from "../../types/playlist/PlaylistInfoData";
import * as yup from "yup";
import { CardMembership } from "@mui/icons-material";
import ErrorSnackbar from "../error/ErrorSnackbar";
import CustomRadio from "../forms/theme-elements/CustomRadio";
import { debounce } from "lodash";

const getTracks = async (
  setTracks: Dispatch<SetStateAction<TrackInfo[]>>,
  params: QueryParams
) => {
  if (params.search) {
    const queryParams = buildQueryParams(params);

    const tracks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/spotify/tracks?${queryParams}`
    );

    setTracks(tracks.data);
  }
};

const TIMELINE_NAME_RECOMMENDATIONS = [
  "Ceremony Begins",
  "Ceremony Ends",
  "Cake Cutting",
  "Introduction",
  "First Dance",
  "Father/Daughter Dance",
  "Mother/Son Dance",
  "Anniversary Dance",
  "Bouquet Toss",
  "Garter Toss",
  "Last Dance/Song",
  "Cocktail Hour",
  "Aperitivo",
  "Dinner Background",
];

const TimelineEdit = ({
  wizardProps,
  values,
  setValues,
  setEdit,
  eventPlaylist,
  getTimeline,
  eventId,
}: {
  wizardProps?: EventWizardProps;
  values: TimelineData[] | undefined;
  setValues: Dispatch<SetStateAction<TimelineData[] | undefined>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  eventPlaylist: PlaylistInfoData | undefined;
  getTimeline?: (
    eventId: string,
    setTimelineInfo: React.Dispatch<
      React.SetStateAction<TimelineData[] | undefined>
    >
  ) => Promise<void>;
  eventId?: number;
}) => {
  const [open, setOpen] = useState<{ state: boolean; index?: number }>({
    state: false,
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [timelineNameInput, setTimelineNameInput] =
    useState<string>("recommended");
  const [tracks, setTracks] = useState<TrackInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      time: dayjs(),
      track: {
        artists: "",
        id: "",
        imageUrl: "",
        name: "",
      },
      instructions: "",
    },
    validationSchema: yup.object({
      time: yup.date().required("Date is required"),
      name: yup.string().required("Name is required"),
    }),
    onSubmit: async (data, { resetForm }) => {
      const timeline = values ?? [];

      if (
        open.index === null ||
        open.index === undefined ||
        open.index === -1
      ) {
        timeline.push({
          instructions: data.instructions,
          name: data.name,
          time: data.time,
          track: data.track,
        });
      } else {
        timeline[open.index] = {
          instructions: data.instructions,
          name: data.name,
          time: data.time,
          track: data.track,
        };
      }

      setValues(
        timeline.sort((cardA, cardB) => {
          if (cardA.time < cardB.time) {
            return -1;
          }
          if (cardA.time > cardB.time) {
            return 1;
          }
          return 0;
        })
      );

      resetForm();

      setOpen({ state: false });
    },
  });

  const debouncedGetTracks = useCallback(
    debounce(async (data) => {
      await getTracks(setTracks, { search: data });
    }, 500),
    []
  );

  const handleClickOpen = (data?: TimelineData) => {
    if (data) {
      formik.setFieldValue("name", data.name);
      formik.setFieldValue("time", data.time);
      formik.setFieldValue("track", data.track);
      formik.setFieldValue("instructions", data.instructions);
    }

    const timelineIndex = values?.findIndex(
      (card) =>
        card.name === data?.name &&
        card.time === data?.time &&
        card.track === data?.track &&
        card.instructions === data?.instructions
    );

    setOpen({ state: true, index: timelineIndex });
  };

  const removeFromTimeline = (data?: TimelineData) => {
    const timeline = values?.filter((card) => {
      if (
        card.name === data?.name &&
        card.time === data?.time &&
        card.track === data?.track &&
        card.instructions === data?.instructions
      ) {
        return false;
      } else {
        return true;
      }
    });

    setValues(timeline);
  };

  const handleClose = () => {
    setOpen({ state: false });
  };

  const compareSelected = (
    item: TrackInfo,
    values: PlaylistInfoData | undefined
  ) => {
    if (!values?.tracks || !values) {
      return false;
    }
    const isAlreadySelected = values.tracks.find(
      (track) => item.id === track.id
    );

    return Boolean(isAlreadySelected);
  };

  const handleSave = async (values: TimelineData[] | undefined) => {
    setLoading(true);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/timelines`,
        JSON.stringify({
          eventId,
          timelines: values?.map((timeline) => ({
            id: timeline.id,
            time: timeline.time,
            name: timeline.name,
            description: timeline.instructions,
            trackId: timeline.track?.id,
            // notes: string().nullable(),
          })),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (setEdit) {
        setEdit(false);
      }

      if (getTimeline) {
        await getTimeline(eventId!.toString(), setValues);
      }

      wizardProps?.handleNext();

      setLoading(false);
    } catch (err: any) {
      setError(err.response.data);

      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 0px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleClickOpen()}
            startIcon={<IconPlus width={18} />}
          >
            Add Event
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (values?.some((timeline) => timeline.id)) {
                setValues([]);
                handleSave([]);
              } else {
                setValues([]);
              }
            }}
            startIcon={<IconTrash width={18} />}
          >
            Clear
          </Button>
        </div>
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
                      <Stack
                        direction="row"
                        justifyContent={"space-between"}
                        alignItems="center"
                      >
                        {card.track?.id ? (
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
                        ) : (
                          <Typography variant="caption">Song: /</Typography>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();

                              removeFromTimeline(card);
                            }}
                          >
                            <IconTrash width={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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
        <Box display="flex" flexDirection="row" mt={3}>
          <Button
            variant="outlined"
            disabled={wizardProps?.activeStep === 0}
            onClick={
              wizardProps
                ? wizardProps.handleBack
                : () => setEdit && setEdit(false)
            }
            sx={{ mr: 1 }}
          >
            {wizardProps ? "Back" : "Cancel"}
          </Button>
          <Box flex="1 1 auto" />
          {wizardProps?.isStepOptional(wizardProps?.activeStep) && (
            <Button
              color="inherit"
              onClick={wizardProps?.handleSkip}
              sx={{ mr: 1 }}
            >
              Skip
            </Button>
          )}

          {loading ? (
            <CircularProgress />
          ) : wizardProps ? (
            <Button variant="contained" onClick={() => handleSave(values)}>
              {wizardProps.activeStep === wizardProps.steps.length
                ? "Finish"
                : "Next"}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => handleSave(values)}>
              Save
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </Box>
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
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        >
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
              <RadioGroup
                row
                aria-label="timelineNameInput"
                name="timelineNameInput"
                sx={{ paddingBottom: "5px" }}
                onChange={(e, newValue) => {
                  formik.setFieldValue("name", "");
                  setTimelineNameInput(newValue);
                }}
                value={timelineNameInput}
              >
                <FormControlLabel
                  value={"recommended"}
                  control={<CustomRadio color="primary" />}
                  label="Recommended Timeline"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"custom"}
                  control={<CustomRadio color="primary" />}
                  label="Custom Timeline"
                  labelPlacement="end"
                />
              </RadioGroup>
              {timelineNameInput === "recommended" ? (
                <Autocomplete
                  disablePortal
                  id="name"
                  options={TIMELINE_NAME_RECOMMENDATIONS}
                  value={formik.values.name}
                  onChange={(e, newValue) => {
                    formik.setFieldValue("name", newValue);
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      placeholder="Select name"
                      aria-label="Select name"
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  )}
                />
              ) : (
                <CustomTextField
                  id="name"
                  variant="outlined"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                />
              )}
              <CustomFormLabel htmlFor="eventDate">Time</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                  DialogProps={{
                    sx: {
                      "& .MuiButtonBase-root": {
                        backgroundColor: "transparent",
                        border: "none",
                      },
                    },
                  }}
                  onChange={(newValue) => {
                    formik.setFieldValue("time", newValue);
                  }}
                  renderInput={(inputProps) => (
                    <CustomTextField
                      fullWidth
                      name="time"
                      variant="outlined"
                      size="medium"
                      error={formik.touched.time && Boolean(formik.errors.time)}
                      helperText={formik.touched.time && formik.errors.time}
                      {...inputProps}
                    />
                  )}
                  value={formik.values.time}
                />
              </LocalizationProvider>
              <CustomFormLabel htmlFor="playlistName">Song</CustomFormLabel>
              <Autocomplete
                id="spotify-search"
                freeSolo
                fullWidth
                PaperComponent={(props) => <Paper {...props} elevation={24} />}
                sx={{
                  mb: 2,
                }}
                onInputChange={async (_, data) => {
                  debouncedGetTracks(data);
                }}
                onChange={(_, data) => {
                  formik.setFieldValue(
                    "track",
                    data || {
                      artists: "",
                      id: "",
                      imageUrl: "",
                      name: "",
                    }
                  );
                }}
                getOptionLabel={(option: string | TrackInfo) =>
                  typeof option === "object"
                    ? `${option.artists} ${option.name}`
                    : ""
                }
                getOptionDisabled={(option) =>
                  compareSelected(option as TrackInfo, eventPlaylist)
                }
                defaultValue={formik.values.track}
                options={
                  tracks?.map((option, index) => {
                    return {
                      ...option,
                      value: index,
                    };
                  }) || []
                }
                filterOptions={(options) => options}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Powered by Spotify"
                    aria-label="PoweredBySpotify"
                    onKeyDown={(event: any) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        event.stopPropagation();
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const track = option as TrackInfo;

                  return (
                    <ListItem {...props} key={track.id}>
                      <ListItemAvatar>
                        <Avatar src={track.imageUrl} />
                      </ListItemAvatar>
                      <ListItemText
                        id={track.id}
                        primary={track.name}
                        secondary={track.artists}
                      />
                    </ListItem>
                  );
                }}
              />
              <CustomFormLabel htmlFor="instructions">
                Instructions
              </CustomFormLabel>
              <CustomTextField
                id="instructions"
                multiline
                rows={4}
                name="instructions"
                value={formik.values.instructions}
                onChange={formik.handleChange}
                variant="outlined"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TimelineEdit;
