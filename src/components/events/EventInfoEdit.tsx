import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Autocomplete, Box, Button, CircularProgress } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import axios from "../../utils/axios";
import { EventWizardProps } from "../../types/eventWizard/EventWizardProps";
import { EventInfoData } from "../../types/events/EventInfoData";
import ErrorSnackbar from "../../components/error/ErrorSnackbar";

dayjs.extend(customParseFormat);

const ARTIST_ID = 2;
const CLIENT_ID = 3;

const getClients = async (
  setClients: Dispatch<
    SetStateAction<{ id: number; fullName: string }[] | undefined>
  >
) => {
  const clients = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts?accountTypeId=${CLIENT_ID}`
  );

  setClients(clients.data.data);
};

const getEventTypes = async (
  setEventTypes: Dispatch<
    SetStateAction<{ id: number; name: string }[] | undefined>
  >
) => {
  const eventTypes = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/types`
  );

  setEventTypes(eventTypes.data);
};

const getArtists = async (
  setArtists: Dispatch<
    SetStateAction<{ id: number; fullName: string }[] | undefined>
  >
) => {
  const artists = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts?accountTypeId=${ARTIST_ID}`
  );

  setArtists(artists.data.data);
};

const EventInfoEdit = ({
  wizardProps,
  values,
  setValues,
  setEdit,
}: {
  wizardProps?: EventWizardProps;
  values: EventInfoData | undefined;
  setValues: Dispatch<SetStateAction<EventInfoData | undefined>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [clients, setClients] = useState<{ id: number; fullName: string }[]>();
  const [eventTypes, setEventTypes] =
    useState<{ id: number; name: string }[]>();
  const [artists, setArtists] = useState<{ id: number; fullName: string }[]>();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      eventName: values?.eventName || "",
      eventType: values?.eventType || {
        id: 0,
        name: "",
      },
      client: values?.client || {
        id: 0,
        fullName: "",
      },
      eventDate: values?.eventDate
        ? dayjs(values?.eventDate, "DD/MM/YYYY")
        : dayjs().add(1, "month"),
      guestCount: values?.guestCount || null,
      artist: values?.artist || {
        id: 0,
        fullName: "",
      },
      location: values?.location || null,
      venueName: values?.venueName || null,
      venueContact: values?.venueContact || null,
      additionalInfo: values?.additionalInfo || null,
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
    onSubmit: async (data) => {
      try {
        if (values?.id) {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${values.id}`,
            JSON.stringify({
              ...data,
              clientId: data?.client?.id,
              artistId: data?.artist?.id,
              eventTypeId: data?.eventType?.id,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setValues(response.data);

          if (setEdit) {
            setEdit(false);
          }

          wizardProps?.handleNext();
        } else {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/events`,
            JSON.stringify({
              ...data,
              clientId: data?.client?.id,
              artistId: data?.artist?.id,
              eventTypeId: data?.eventType?.id,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setValues(response.data);

          wizardProps?.handleNext();
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
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
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
          value={formik.values.guestCount}
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
          value={formik.values.location}
          onChange={formik.handleChange}
          fullWidth
        />
        <CustomFormLabel htmlFor="venueName">Venue name</CustomFormLabel>
        <CustomTextField
          id="venueName"
          variant="outlined"
          name="venueName"
          value={formik.values.venueName}
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
          value={formik.values.venueContact}
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
          value={formik.values.additionalInfo}
          onChange={formik.handleChange}
          variant="outlined"
          fullWidth
        />

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

          {formik.isSubmitting ? (
            <CircularProgress />
          ) : wizardProps ? (
            <Button variant="contained" type="submit">
              {wizardProps.activeStep === wizardProps.steps.length
                ? "Finish"
                : "Next"}
            </Button>
          ) : (
            <Button variant="contained" type="submit">
              Save
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </form>
    </Box>
  );
};

export default EventInfoEdit;
