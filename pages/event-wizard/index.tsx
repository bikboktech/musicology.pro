import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Alert,
  Grid,
  Autocomplete,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  useTheme,
  Paper,
  CardHeader,
  Divider,
  List,
  RadioGroup,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Link,
  Tooltip,
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
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import dayjs, { Dayjs } from "dayjs";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomCheckbox from "../../src/components/forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import ParentCard from "../../src/components/shared/ParentCard";
import { Stack } from "@mui/system";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import top100Films from "../../src/components/forms/form-elements/autoComplete/data";
import { IconChevronUp, IconPhoto, IconSearch } from "@tabler/icons-react";
import { CheckBox } from "@mui/icons-material";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  IconChevronDown,
  IconTrash,
  IconXboxX,
  IconPlus,
} from "@tabler/icons-react";
import CustomRadio from "../../src/components/forms/theme-elements/CustomRadio";
import Scrollbar from "../../src/components/custom-scroll/Scrollbar";

const steps = ["Event info", "Your playlist", "Timeline"];

type TrackInfo = {
  value: number;
  title: string;
  year: string;
};

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}

const TABS = [
  {
    value: "playlistTemplate1",
    label: "Playlist Template 1",
  },
  {
    value: "playlistTemplate2",
    label: "Playlist Template 2",
  },
  {
    value: "playlistTemplate3",
    label: "Playlist Template 3",
  },
  {
    value: "playlistTemplate4",
    label: "Playlist Template 4",
  },
  {
    value: "playlistTemplate5",
    label: "Playlist Template 5",
  },
  {
    value: "playlistTemplate6",
    label: "Playlist Template 6",
  },
  {
    value: "playlistTemplate7",
    label: "Playlist Template 7",
  },
];

const EventWizard = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [value3, setValue3] = React.useState<Dayjs | null>(
    dayjs("2018-01-01T00:00:00.000Z")
  );
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
  const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
  const [playlistName, setPlaylistName] = React.useState<string>("");
  const [playlistCreationType, setPlaylistCreationType] =
    React.useState<string>("spotifySearch");
  const [playlistTracks, setPlaylistTracks] = React.useState<TrackInfo[]>([]);
  const [playlistLink, setPlaylistLink] = React.useState<string>();
  const [openTab, setOpenTab] = React.useState("playlistTemplate1");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setOpenTab(newValue);
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedUp = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedDown = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const theme = useTheme();
  const borderColor = theme.palette.primary.main;

  const isStepOptional = (step: any) => step === 1 || step == 2;

  const isStepSkipped = (step: any) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const customList = (title: React.ReactNode, items: TrackInfo[]) => {
    const trackInfoIds = items.map((item) => item.value);

    return (
      <Paper variant="outlined" sx={{ border: `1px solid ${borderColor}` }}>
        <CardHeader
          sx={{ px: 2 }}
          action={
            <IconButton disabled={trackInfoIds.length === 0}>
              <IconTrash />
            </IconButton>
          }
          avatar={
            <CustomCheckbox
              onClick={handleToggleAll(trackInfoIds)}
              checked={
                numberOfChecked(trackInfoIds) === items.length &&
                items.length !== 0
              }
              indeterminate={
                numberOfChecked(trackInfoIds) !== items.length &&
                numberOfChecked(trackInfoIds) !== 0
              }
              disabled={trackInfoIds.length === 0}
              inputProps={{
                "aria-label": "all items selected",
              }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(trackInfoIds)}/${
            items.length
          } selected`}
        />
        <Divider />
        <List
          sx={{
            width: "100%",
            height: 230,
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.map((item) => {
            const labelId = `transfer-list-all-item-${item.value}-label`;

            return (
              <ListItem
                key={item.value}
                role="listitem"
                button
                onClick={handleToggle(item.value)}
              >
                <ListItemIcon>
                  <CustomCheckbox
                    checked={checked.indexOf(item.value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemAvatar>
                  <Avatar>
                    <IconPhoto width={20} height={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  primary={item.title}
                  secondary={item.year}
                />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Paper>
    );
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);

      return newSkipped;
    });
  };

  // eslint-disable-next-line consistent-return
  const handleSteps = (step: any) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <CustomFormLabel htmlFor="eventName">Event name</CustomFormLabel>
            <CustomTextField id="eventName" variant="outlined" fullWidth />
            <Box>
              <CustomFormLabel htmlFor="eventDate">
                Planned event date
              </CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  onChange={(newValue) => {
                    //   setValue3(newValue);
                  }}
                  renderInput={(inputProps) => (
                    <CustomTextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                      inputProps={{ "aria-label": "basic date picker" }}
                      {...inputProps}
                    />
                  )}
                  value={value3}
                />
              </LocalizationProvider>
            </Box>
            <CustomFormLabel htmlFor="venueName">Venue name</CustomFormLabel>
            <CustomTextField id="venueName" variant="outlined" fullWidth />
            <CustomFormLabel htmlFor="Address">Address</CustomFormLabel>
            <CustomTextField
              id="Address"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </Box>
        );
      case 1:
        return (
          <>
            <Box>
              <CustomFormLabel htmlFor="playlistName">
                Playlist name
              </CustomFormLabel>
              <CustomTextField
                id="playlistName"
                variant="outlined"
                value={playlistName}
                onChange={(event: any) => {
                  setPlaylistName(event.target.value);
                }}
                fullWidth
              />
              <Box>
                <CustomFormLabel htmlFor="playlistCreationType">
                  Choose the way you want to create your playlist
                </CustomFormLabel>
                <RadioGroup
                  row
                  aria-label="playlistCreationType"
                  name="playlistCreationType"
                  value={playlistCreationType}
                  onChange={(event: any) => {
                    setPlaylistCreationType(event.target.value);
                  }}
                >
                  <FormControlLabel
                    value="spotifySearch"
                    control={<CustomRadio color="primary" />}
                    label="Search Spotify"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="importExistingSpotifyLink"
                    control={<CustomRadio color="primary" />}
                    label="Import existing Spotify Playlist"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="recommendedPlaylists"
                    control={<CustomRadio color="primary" />}
                    label="Recommended playlists"
                    labelPlacement="end"
                  />
                </RadioGroup>
              </Box>
              {playlistCreationType === "spotifySearch" && (
                <>
                  <CustomFormLabel htmlFor="playlistName">
                    Search for your song here:
                  </CustomFormLabel>
                  <Autocomplete
                    id="spotify-search"
                    freeSolo
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                    onChange={(_, data) => {
                      if (data) {
                        setPlaylistTracks([...playlistTracks, data]);
                      }
                    }}
                    getOptionLabel={(
                      option:
                        | string
                        | { value: number; title: string; year: number }
                    ) => (typeof option === "object" ? option.title : "")}
                    options={top100Films.map((option, index) => ({
                      ...option,
                      value: index,
                    }))}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Powered by Spotify"
                        aria-label="PoweredBySpotify"
                      />
                    )}
                    renderOption={(props, option) => (
                      <ListItem
                        {...props}
                        // onClick={handleToggle(value)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <IconPhoto width={20} height={20} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          id={option.value.toString()}
                          primary={option.title}
                          secondary={option.year}
                        />
                      </ListItem>
                    )}
                  />
                </>
              )}
              {playlistCreationType === "importExistingSpotifyLink" && (
                <>
                  <CustomFormLabel htmlFor="importExistingSpotifyLink">
                    Playlist link:
                  </CustomFormLabel>
                  <CustomTextField
                    id="importExistingSpotifyLink"
                    variant="outlined"
                    placeholder="Insert your Spotify Playlist Link here"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                    onKeyPress={(ev) => {
                      // if (ev.key === "Enter") {
                      //   debouncedSearch(refetch, variables, searchValue);
                      // }
                    }}
                    // value={searchValue}
                    InputProps={{
                      startAdornment: (
                        <IconButton
                          aria-label="search"
                          onClick={
                            () => {}
                            // removeQuoteIdFilter(refetch, variables)
                          }
                        >
                          <IconSearch />
                        </IconButton>
                      ),
                      endAdornment: (
                        <IconButton
                          aria-label="remove"
                          onClick={
                            () => {}
                            // removeQuoteIdFilter(refetch, variables)
                          }
                        >
                          <IconXboxX />
                        </IconButton>
                      ),
                    }}
                    // onChange={(event) =>
                    //   handleSearchInput(refetch, variables, event)
                    // }
                  />
                </>
              )}
              {playlistCreationType === "recommendedPlaylists" && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <CustomFormLabel htmlFor="recommendedPlaylists">
                    Select a recommended playlist:
                  </CustomFormLabel>
                  <Tabs
                    value={openTab}
                    onChange={handleTabChange}
                    aria-label="clients"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {TABS.map((tab) => (
                      <Tab
                        key={tab.value}
                        // icon={tab.icon}
                        label={tab.label}
                        iconPosition="top"
                        value={tab.value}
                      />
                    ))}
                  </Tabs>
                </Box>
              )}
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                {playlistCreationType !== "spotifySearch" && (
                  <>
                    <Grid item width={"100%"}>
                      {customList(
                        "Other Playlist",
                        top100Films.map((el, index) => ({
                          ...el,
                          value: index,
                        }))
                      )}
                    </Grid>
                    <Grid item width={"100%"}>
                      <Stack spacing={1}>
                        <Button
                          variant="outlined"
                          size="medium"
                          onClick={handleCheckedUp}
                          disabled={leftChecked.length === 0}
                          aria-label="move selected right"
                        >
                          <IconChevronDown width={20} height={20} />
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          onClick={handleCheckedDown}
                          disabled={rightChecked.length === 0}
                          aria-label="move selected left"
                        >
                          <IconChevronUp width={20} height={20} />
                        </Button>
                      </Stack>
                    </Grid>
                  </>
                )}
                <Grid item width={"100%"}>
                  {customList(
                    playlistName || "Custom Playlist",
                    playlistTracks
                  )}
                </Grid>
              </Grid>
            </Box>
          </>
        );
      case 2:
        return (
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 0px",
              }}
            >
              <Button variant="outlined" startIcon={<IconPlus width={18} />}>
                Add Card
              </Button>
              <Button variant="outlined" startIcon={<IconTrash width={18} />}>
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
                    mb: "-40px",
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.5,
                      paddingLeft: 0,
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ m: "auto 0" }}>
                      09:30 am
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
                        // onClick={() => dispatch(SelectNote(note.id))}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          color={"primary.main"}
                          sx={{ paddingBottom: "5px" }}
                        >
                          Opening song
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            Song: Ej, otkad sam se rodio
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              // onClick={() => dispatch(DeleteNote(note.id))}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption">
                          Instructions: Shoot at the ceiling
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ m: "auto 0" }}>
                      10:00 am
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
                        // onClick={() => dispatch(SelectNote(note.id))}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          color={"primary.main"}
                          sx={{ paddingBottom: "5px" }}
                        >
                          First dance
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            Song: Bojna Cavoglave
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              // onClick={() => dispatch(DeleteNote(note.id))}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption">
                          Instructions: None
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineOppositeContent>12:00 am</TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="success" variant="outlined" />
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
                        // onClick={() => dispatch(SelectNote(note.id))}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          color={"primary.main"}
                          sx={{ paddingBottom: "5px" }}
                        >
                          Walking to altar
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            Song: Rocky theme song
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              // onClick={() => dispatch(DeleteNote(note.id))}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption">
                          Instructions: Don't let the groom escape
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineOppositeContent>09:30 am</TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="warning" variant="outlined" />
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
                        // onClick={() => dispatch(SelectNote(note.id))}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          color={"primary.main"}
                          sx={{ paddingBottom: "5px" }}
                        >
                          Opening song
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            Song: Ej, otkad sam se rodio
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              // onClick={() => dispatch(DeleteNote(note.id))}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption">
                          Instructions: Shoot at the ceiling
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineOppositeContent>09:30 am</TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="error" variant="outlined" />
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
                        // onClick={() => dispatch(SelectNote(note.id))}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          color={"primary.main"}
                          sx={{ paddingBottom: "5px" }}
                        >
                          Opening song
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            Song: Ej, otkad sam se rodio
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              // onClick={() => dispatch(DeleteNote(note.id))}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption">
                          Instructions: Shoot at the ceiling
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineOppositeContent>12:00 am</TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="success" variant="outlined" />
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
                        // onClick={() => dispatch(SelectNote(note.id))}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          color={"primary.main"}
                          sx={{ paddingBottom: "5px" }}
                        >
                          Opening song
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption">
                            Song: Ej, otkad sam se rodio
                          </Typography>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              // onClick={() => dispatch(DeleteNote(note.id))}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption">
                          Instructions: Shoot at the ceiling
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Scrollbar>
            </Stack>
          </Box>
        );
      default:
        break;
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <PageContainer>
      <Breadcrumb
        title="This is your event creating wizard"
        subtitle="Please follow the steps below to set up your event"
      />
      <Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <ParentCard
            title=""
            cardStyle={{ boxShadow: "none" }}
            removeDivider={true}
          >
            <Box width="100%">
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: {
                    optional?: React.ReactNode;
                  } = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === steps.length ? (
                <>
                  <Box pt={3}>
                    <Typography variant="h5">Terms and condition</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Sard about this site or you have been to it, but you
                      cannot figure out what it is or what it can do. MTA web
                      directory isSard about this site or you have been to it,
                      but you cannot figure out what it is or what it can do.
                      MTA web directory is
                    </Typography>
                    <FormControlLabel
                      control={<CustomCheckbox defaultChecked />}
                      label="Agree with terms?"
                    />
                    <Box textAlign="right">
                      <Button onClick={handleReset} variant="outlined">
                        Accept
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box>{handleSteps(activeStep)}</Box>

                  <Box display="flex" flexDirection="row" mt={3}>
                    <Button
                      variant="outlined"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box flex="1 1 auto" />
                    {isStepOptional(activeStep) && (
                      <Button
                        color="inherit"
                        onClick={handleSkip}
                        sx={{ mr: 1 }}
                      >
                        Skip
                      </Button>
                    )}

                    <Button onClick={handleNext} variant="contained">
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

EventWizard.layout = "Blank";
export default EventWizard;
