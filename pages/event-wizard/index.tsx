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
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import dayjs, { Dayjs } from "dayjs";

import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomCheckbox from "../../src/components/forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import ParentCard from "../../src/components/shared/ParentCard";
import { Stack } from "@mui/system";
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
import EventInfo from "./EventInfoEdit";
import Playlist from "./PlaylistEdit";
import TimelineComponent from "./TimelineEdit";
import PlaylistEdit from "./PlaylistEdit";
import EventInfoEdit from "./EventInfoEdit";
import { EventInfoData } from "../../src/types/events/EventInfoData";

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
  const [eventInfoValues, setEventInfoValues] = React.useState<EventInfoData>({
    id: null,
    eventName: "",
    eventType: {
      id: 0,
      name: "",
    },
    client: {
      id: 0,
      fullName: "",
    },
    eventDate: dayjs().add(1, "month"),
    guestCount: null,
    artist: {
      id: 0,
      fullName: "",
    },
    location: null,
    venueName: null,
    venueContact: null,
    address: null,
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
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
          <EventInfoEdit
            wizardProps={{
              activeStep,
              handleBack,
              isStepOptional,
              handleSkip,
              handleNext,
              steps,
            }}
            values={eventInfoValues}
            setValues={setEventInfoValues}
          />
        );
      case 1:
        return <PlaylistEdit />;
      case 2:
        return <TimelineComponent />;
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
