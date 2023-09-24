import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as yup from "yup";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  useFormik,
} from "formik";
import { Autocomplete, Box, Button, CircularProgress } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs, { Dayjs } from "dayjs";

import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import axios, { AxiosError } from "axios";
import { EventInfoWizardProps } from "../../src/types/events/EventInfoWizardProps";
import { EventInfoData } from "../../src/types/events/EventInfoData";
import ErrorSnackbar from "../../src/components/error/ErrorSnackbar";

const getClients = async (
  setClients: Dispatch<
    SetStateAction<{ id: number; fullName: string }[] | undefined>
  >
) => {
  const clients = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/clients`
  );

  setClients(clients.data);
};

const getEventTypes = async (
  setEventTypes: Dispatch<
    SetStateAction<{ id: number; name: string }[] | undefined>
  >
) => {
  const eventTypes = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/event-types`
  );

  setEventTypes(eventTypes.data);
};

const getArtists = async (
  setArtists: Dispatch<
    SetStateAction<{ id: number; fullName: string }[] | undefined>
  >
) => {
  const artists = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/artists`
  );

  setArtists(artists.data);
};

const EventInfoEdit = ({
  wizardProps,
  values,
  setValues,
}: {
  wizardProps: EventInfoWizardProps;
  values: EventInfoData;
  setValues: Dispatch<SetStateAction<EventInfoData>>;
}) => {
  const {
    activeStep,
    handleBack,
    isStepOptional,
    handleSkip,
    handleNext,
    steps,
  } = wizardProps;

  const {
    id,
    eventName,
    eventType,
    client,
    eventDate,
    guestCount,
    artist,
    location,
    venueName,
    venueContact,
    additionalInfo,
  } = values;

  const [clients, setClients] = useState<{ id: number; fullName: string }[]>();
  const [eventTypes, setEventTypes] =
    useState<{ id: number; name: string }[]>();
  const [artists, setArtists] = useState<{ id: number; fullName: string }[]>();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      eventName,
      eventType,
      client,
      eventDate,
      guestCount,
      artist,
      location,
      venueName,
      venueContact,
      additionalInfo,
    },
    validationSchema: yup.object({
      eventName: yup.string().required("Event name is required"),
      eventType: yup.object({
        id: yup.number(),
        name: yup.string().required("Event type is required"),
      }),
      client: yup.object({
        id: yup.number(),
        fullName: yup.string().required("Client is required"),
      }),
      eventDate: yup.date().required("Event date is required"),
      artist: yup.object({
        id: yup.number(),
        fullName: yup.string().required("Artist is required"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        if (id) {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/event-info/${id}`,
            JSON.stringify({
              ...values,
              clientId: values.client.id,
              artistId: values.artist.id,
              eventTypeId: values.eventType.id,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setValues(response.data);
        } else {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/event-info`,
            JSON.stringify({
              ...values,
              clientId: values.client.id,
              artistId: values.artist.id,
              eventTypeId: values.eventType.id,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setValues(response.data);
        }
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

  useEffect(() => {
    if (!clients) {
      getClients(setClients);
    }
  }, [clients]);

  useEffect(() => {
    if (!artists) {
      getArtists(setArtists);
    }
  }, [artists]);

  useEffect(() => {
    if (!eventTypes) {
      getEventTypes(setEventTypes);
    }
  }, [eventTypes]);

  useEffect(() => {
    const el = document.querySelector(".Mui-error, [data-error]");
    (el?.parentElement ?? el)?.scrollIntoView();
  }, [formik.isSubmitting]);

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="eventName">Event name</CustomFormLabel>
        <CustomTextField
          id="eventName"
          variant="outlined"
          name="eventName"
          value={formik.values.eventName}
          onChange={formik.handleChange}
          error={formik.touched.eventName && Boolean(formik.errors.eventName)}
          helperText={formik.touched.eventName && formik.errors.eventName}
          fullWidth
        />
        <CustomFormLabel htmlFor="eventType">Event Type</CustomFormLabel>
        <Autocomplete
          disablePortal
          id="eventType"
          options={eventTypes ?? []}
          getOptionLabel={(option) => option.name}
          value={formik.values.eventType}
          onChange={(e, newValue) => {
            formik.setFieldValue("eventType", newValue);
          }}
          fullWidth
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder="Select event type"
              aria-label="Select event type"
              error={
                formik.touched.eventType &&
                Boolean(formik.errors.eventType?.name)
              }
              helperText={
                formik.touched.eventType && formik.errors.eventType?.name
              }
            />
          )}
        />
        <CustomFormLabel htmlFor="client">Client</CustomFormLabel>
        <Autocomplete
          disablePortal
          id="client"
          options={clients ?? []}
          getOptionLabel={(option) => option.fullName}
          value={formik.values.client}
          onChange={(e, newValue) => {
            formik.setFieldValue("client", newValue);
          }}
          fullWidth
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder="Select client"
              aria-label="Select client"
              error={
                formik.touched.client && Boolean(formik.errors.client?.fullName)
              }
              helperText={
                formik.touched.client && formik.errors.client?.fullName
              }
            />
          )}
        />
        <Box>
          <CustomFormLabel htmlFor="eventDate">
            Planned event date
          </CustomFormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              onChange={(newValue) => {
                formik.setFieldValue("eventDate", newValue);
              }}
              renderInput={(inputProps) => (
                <CustomTextField
                  fullWidth
                  name="eventDate"
                  variant="outlined"
                  size="medium"
                  error={
                    formik.touched.eventDate && Boolean(formik.errors.eventDate)
                  }
                  helperText={
                    formik.touched.eventDate && formik.errors.eventDate
                  }
                  {...inputProps}
                />
              )}
              value={formik.values.eventDate}
            />
          </LocalizationProvider>
        </Box>
        <CustomFormLabel htmlFor="guestCount">
          Estimated guest count
        </CustomFormLabel>
        <CustomTextField
          id="guestCount"
          variant="outlined"
          name="guestCount"
          type="number"
          onChange={formik.handleChange}
          fullWidth
        />
        <CustomFormLabel htmlFor="artist">Artist</CustomFormLabel>
        <Autocomplete
          disablePortal
          id="artist"
          options={artists ?? []}
          getOptionLabel={(option) => option.fullName}
          value={formik.values.artist}
          onChange={(e, newValue) => {
            formik.setFieldValue("artist", newValue);
          }}
          fullWidth
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder="Select artist"
              aria-label="Select artist"
              error={
                formik.touched.artist && Boolean(formik.errors.artist?.fullName)
              }
              helperText={
                formik.touched.artist && formik.errors.artist?.fullName
              }
            />
          )}
        />
        <CustomFormLabel htmlFor="location">Location</CustomFormLabel>
        <CustomTextField
          id="location"
          variant="outlined"
          name="location"
          onChange={formik.handleChange}
          fullWidth
        />
        <CustomFormLabel htmlFor="venueName">Venue name</CustomFormLabel>
        <CustomTextField
          id="venueName"
          variant="outlined"
          name="venueName"
          onChange={formik.handleChange}
          fullWidth
        />
        <CustomFormLabel htmlFor="venueContact">
          Venue contact person
        </CustomFormLabel>
        <CustomTextField
          id="venueContact"
          variant="outlined"
          name="venueContact"
          onChange={formik.handleChange}
          fullWidth
        />
        <CustomFormLabel htmlFor="additionalInfo">
          Additional info
        </CustomFormLabel>
        <CustomTextField
          id="additionalInfo"
          multiline
          rows={4}
          name="additionalInfo"
          onChange={formik.handleChange}
          variant="outlined"
          fullWidth
        />

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
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          {formik.isSubmitting ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" type="submit">
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </form>
    </Box>
  );
};

export default EventInfoEdit;
