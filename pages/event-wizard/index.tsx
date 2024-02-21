import React, { useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import CustomCheckbox from "../../src/components/forms/theme-elements/CustomCheckbox";
import ParentCard from "../../src/components/shared/ParentCard";
import TimelineEdit from "../../src/components/timeline/TimelineEdit";
import PlaylistEdit from "../../src/components/playlists/PlaylistEdit";
import EventInfoEdit from "../../src/components/events/EventInfoEdit";
import { EventInfoData } from "../../src/types/events/EventInfoData";
import { PlaylistInfoData } from "../../src/types/playlist/PlaylistInfoData";
import { TimelineData } from "../../src/types/timeline/TimelineData";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import ContractInfo from "../../src/components/contract/ContractInfo";

const steps = ["Event info", "Your playlist", "Timeline"];

const EventWizard = () => {
  const [eventInfoValues, setEventInfoValues] = React.useState<EventInfoData>();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [playlistValues, setPlaylistValues] =
    React.useState<PlaylistInfoData>();
  const [timelineValues, setTimelineValues] = React.useState<TimelineData[]>();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const isStepOptional = (step: any) => step === 1 || step == 2;

  const isStepSkipped = (step: any) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep !== steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      router.push("/");
    }
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    if (activeStep !== steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      router.push("/");
    }
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
        return (
          <PlaylistEdit
            wizardProps={{
              activeStep,
              handleBack,
              isStepOptional,
              handleSkip,
              handleNext,
              steps,
            }}
            eventId={eventInfoValues?.id}
            values={playlistValues}
            setValues={setPlaylistValues}
          />
        );
      case 2:
        return (
          <TimelineEdit
            wizardProps={{
              activeStep,
              handleBack,
              isStepOptional,
              handleSkip,
              handleNext,
              steps,
            }}
            eventPlaylist={playlistValues}
            values={timelineValues}
            setValues={setTimelineValues}
            eventId={eventInfoValues?.id as number | undefined}
          />
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
                <div style={{ paddingTop: "20px" }}>
                  <ContractInfo
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
                </div>
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
