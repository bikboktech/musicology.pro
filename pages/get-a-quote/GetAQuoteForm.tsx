import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  RadioGroup,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import Link from "next/link";
import dayjs, { Dayjs } from "dayjs";
import CustomCheckbox from "../../src/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import CustomRadio from "../../src/components/forms/theme-elements/CustomRadio";
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "../../src/utils/axios";
import ErrorSnackbar from "../../src/components/error/ErrorSnackbar";
import Image from "next/image";
import { IconCircleCheck } from "@tabler/icons-react";

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

const EXTRA_MUSICIAN_OPTIONS = [
  {
    id: "saxophone",
    label: "Saxophone",
  },
  {
    id: "percussion",
    label: "Percussion",
  },
  {
    id: "el. violin",
    label: "El. Violin",
  },
  {
    id: "vocalist/singer/emcee",
    label: "Vocalist/Singer/Emcee",
  },
  {
    id: "band",
    label: "Band",
  },
];

const NATURAL_APPROACH_INTERACTION_OPTIONS = [
  {
    id: "thoroughPreparations",
    label: "Prefer thorough preparation and dislike unexpected surprises",
  },
  {
    id: "sociableAtmosphere",
    label:
      "Prioritize relationship building and maintain a sociable atmosphere",
  },
  {
    id: "logicalThinking",
    label: "Favor logical thinking and prioritize results in interactions",
  },
];

const EVENT_BUDGET_OPTIONS = [
  {
    id: "1.5-2",
    label: "€1.500 - €2.000 (2 - 4 hours of Show Time)",
  },
  {
    id: "2-5",
    label: "€2.000 - €5.000 (All inclusive Service)",
  },
  {
    id: "5-more",
    label: "€5.000 - MORE (All day options, Special Packages)",
  },
];

const MARKETING_TYPE_OPTIONS = [
  {
    id: "weddingPlanner",
    label: "Wedding Planner",
  },
  {
    id: "instagramBrowsing",
    label: "Instagram Browsing",
  },
  {
    id: "googleSearch",
    label: "Google Search",
  },
  {
    id: "friendReferral",
    label: "Friend Referral",
  },
  {
    id: "other",
    label: "Other",
  },
];

const WEDDING_EVENT_TYPE = 1;

const HOURS_OF_ENTERTAINMENT_OPTIONS = [
  {
    id: "4hrs",
    label: "Up to 4hrs of music",
  },
  {
    id: "6hrs",
    label: "Up to 6hrs of music",
  },
  {
    id: "10hrs",
    label: "Up to 10hrs of music",
  },
  {
    id: "other",
    label: "Other",
  },
];

const GetAQuoteForm = () => {
  const [eventTypes, setEventTypes] =
    useState<{ id: number; name: string }[]>();
  const [error, setError] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<number | null>(null);

  useEffect(() => {
    if (!eventTypes) {
      getEventTypes(setEventTypes);
    }
  }, [eventTypes]);

  const formik = useFormik({
    initialValues: {
      email: "",
      eventTypeId: WEDDING_EVENT_TYPE,
      clientName: "",
      eventDate: dayjs().add(1, "month"),
      guestCount: null,
      eventLocation: "",
      eventBudget: null,
      marketingType: null,
      hoursOfEntertainment: null,
      extraMusician: null,
      audioSupport: false,
      naturalApproachInteractions: null,
      referencePlaylistLink: "",
      otherMarketingType: "",
      otherHoursOfEntertainment: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Email must be valid")
        .required("Email is required"),
      eventTypeId: yup.number().required("Event type is required"),
      eventDate: yup.date().required("Event date is required"),
      eventLocation: yup.string().required("Location is required"),
      clientName: yup.string().required("Name is required"),
      guestCount: yup.number().positive().required("Guest Count is required"),
      naturalApproachInteractions: yup
        .string()
        .required("This question is required"),
    }),
    onSubmit: async (data) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes`,
          JSON.stringify({
            email: data.email,
            eventTypeId: data.eventTypeId,
            eventDate: data.eventDate,
            clientName: data.clientName,
            guestCount: data.guestCount,
            eventLocation: data.eventLocation,
            eventBudget: EVENT_BUDGET_OPTIONS.find(
              (eventBudgetOption) => eventBudgetOption.id === data.eventBudget
            )?.label,
            marketingType:
              data.marketingType === "other"
                ? data.otherMarketingType
                : MARKETING_TYPE_OPTIONS.find(
                    (marketingTypeOption) =>
                      marketingTypeOption.id === data.marketingType
                  )?.label,
            extraMusician: EXTRA_MUSICIAN_OPTIONS.find(
              (extraMusicianOption) =>
                extraMusicianOption.id === data.extraMusician
            )?.label,
            hoursOfEntertainment:
              data.hoursOfEntertainment === "other"
                ? data.otherHoursOfEntertainment
                : HOURS_OF_ENTERTAINMENT_OPTIONS.find(
                    (hoursOfEntertainmentOption) =>
                      hoursOfEntertainmentOption.id ===
                      data.hoursOfEntertainment
                  )?.label,
            audioSupport: data.audioSupport,
            naturalApproachInteractions:
              NATURAL_APPROACH_INTERACTION_OPTIONS.find(
                (naturalApproachInteractionOption) =>
                  naturalApproachInteractionOption.id ===
                  data.naturalApproachInteractions
              )?.label,
            referencePlaylistLink: data.referencePlaylistLink,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setQuoteId(response.data.id);
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

  if (quoteId) {
    return (
      <Box textAlign="center" mb={3}>
        <IconCircleCheck style={{ height: "100px", width: "100px" }} />
        <Typography variant="h3" mb={2}>
          Thank you for taking the time to fill out this form, we will get back
          to you as soon as possible.
        </Typography>
        <Button
          component={Link}
          href="https://musicologyentertainment.com/"
          variant="contained"
        >
          Go back to Homepage
        </Button>
      </Box>
    );
  }

  return formik.isSubmitting ? (
    <CircularProgress />
  ) : (
    <>
      <Typography fontWeight="700" variant="h3" mb={1}>
        EVENT QUESTIONARY
      </Typography>
      Please fill out this form to get as much understanding of how you envision
      your special day.
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
        <Stack>
          <Box>
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              id="email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="eventType">Type of Event</CustomFormLabel>
            <RadioGroup
              row
              aria-label="eventType"
              name="eventType"
              onChange={(e, newValue) => {
                formik.setFieldValue("eventTypeId", parseInt(newValue));
              }}
              value={formik.values.eventTypeId}
            >
              {eventTypes?.map((eventType) => (
                <FormControlLabel
                  key={eventType.id}
                  value={eventType.id}
                  control={<CustomRadio color="primary" />}
                  label={eventType.name}
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
          </Box>
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
                    variant="outlined"
                    size="small"
                    error={
                      formik.touched.eventDate &&
                      Boolean(formik.errors.eventDate)
                    }
                    helperText={
                      formik.touched.eventDate && formik.errors.eventDate
                    }
                    inputProps={{ "aria-label": "basic date picker" }}
                    {...inputProps}
                  />
                )}
                value={formik.values.eventDate}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <CustomFormLabel htmlFor="clientName">
              {formik.values.eventTypeId === WEDDING_EVENT_TYPE
                ? "Bride and Groom's"
                : "Client"}{" "}
              name
            </CustomFormLabel>
            <CustomTextField
              id="clientName"
              variant="outlined"
              fullWidth
              value={formik.values.clientName}
              onChange={formik.handleChange}
              error={
                formik.touched.clientName && Boolean(formik.errors.clientName)
              }
              helperText={formik.touched.clientName && formik.errors.clientName}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="guestCount">
              Estimated guest count (number of guests)
            </CustomFormLabel>
            <CustomTextField
              id="guestCount"
              variant="outlined"
              fullWidth
              type="number"
              value={formik.values.guestCount}
              onChange={formik.handleChange}
              error={
                formik.touched.guestCount && Boolean(formik.errors.guestCount)
              }
              helperText={formik.touched.guestCount && formik.errors.guestCount}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="eventLocation">
              Event location (venue)
            </CustomFormLabel>
            <CustomTextField
              id="eventLocation"
              variant="outlined"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.eventLocation}
              error={
                formik.touched.eventLocation &&
                Boolean(formik.errors.eventLocation)
              }
              helperText={
                formik.touched.eventLocation && formik.errors.eventLocation
              }
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="extraMusician">
              Did you consider booking extra musicians?
            </CustomFormLabel>
            <RadioGroup
              row
              aria-label="extraMusician"
              name="extraMusician"
              onChange={(e, newValue) => {
                formik.setFieldValue("extraMusician", newValue);
              }}
              value={formik.values.extraMusician}
            >
              {EXTRA_MUSICIAN_OPTIONS.map((extraMusicianOption) => (
                <FormControlLabel
                  key={extraMusicianOption.id}
                  value={extraMusicianOption.id}
                  control={<CustomRadio color="primary" />}
                  label={extraMusicianOption.label}
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
          </Box>
          <Box>
            <CustomFormLabel htmlFor="audioSupport">
              Do you require our ceremony audio support? (speakers, microphones
              and prelude music for ceremony with support)
            </CustomFormLabel>
            <RadioGroup
              row
              aria-label="audioSupport"
              name="audioSupport"
              onChange={(e, newValue) => {
                formik.setFieldValue("audioSupport", newValue);
              }}
              value={formik.values.audioSupport}
            >
              <FormControlLabel
                value={false}
                control={<CustomRadio color="primary" />}
                label="No"
                labelPlacement="end"
              />
              <FormControlLabel
                value={true}
                control={<CustomRadio color="primary" />}
                label="Yes"
                labelPlacement="end"
              />
            </RadioGroup>
          </Box>
          <Box>
            <CustomFormLabel htmlFor="hoursOfEntertainment">
              How many hours of music/entertainment do you require? (start and
              end time)
            </CustomFormLabel>
            <RadioGroup
              row
              aria-label="hoursOfEntertainment"
              name="hoursOfEntertainment"
              onChange={(e, newValue) => {
                formik.setFieldValue("hoursOfEntertainment", newValue);
              }}
              value={formik.values.hoursOfEntertainment}
            >
              {HOURS_OF_ENTERTAINMENT_OPTIONS.map(
                (hoursOfEntertainmentOption) => (
                  <FormControlLabel
                    key={hoursOfEntertainmentOption.id}
                    value={hoursOfEntertainmentOption.id}
                    control={<CustomRadio color="primary" />}
                    label={hoursOfEntertainmentOption.label}
                    labelPlacement="end"
                  />
                )
              )}
            </RadioGroup>
            {formik.values.hoursOfEntertainment === "other" && (
              <CustomTextField
                id="otherHoursOfEntertainment"
                variant="outlined"
                fullWidth
                value={formik.values.otherHoursOfEntertainment}
                onChange={formik.handleChange}
              />
            )}
          </Box>
          <Box>
            <CustomFormLabel htmlFor="audioSupport">
              Which of these descriptions resonates most with your natural
              approach in interactions?
            </CustomFormLabel>
            <RadioGroup
              row
              aria-label="naturalApproachInteractions"
              name="naturalApproachInteractions"
              onChange={(e, newValue) => {
                formik.setFieldValue("naturalApproachInteractions", newValue);
              }}
              value={formik.values.naturalApproachInteractions}
            >
              {NATURAL_APPROACH_INTERACTION_OPTIONS.map(
                (naturalApproachInteractionOption) => (
                  <FormControlLabel
                    key={naturalApproachInteractionOption.id}
                    value={naturalApproachInteractionOption.id}
                    control={<CustomRadio color="primary" />}
                    label={naturalApproachInteractionOption.label}
                    labelPlacement="end"
                  />
                )
              )}
            </RadioGroup>
            {formik.touched.naturalApproachInteractions &&
              formik.errors.naturalApproachInteractions && (
                <FormHelperText error>
                  Choose your natural approach in interactions
                </FormHelperText>
              )}
          </Box>
          <Box>
            <CustomFormLabel htmlFor="eventBudget">
              Planned budget for entertainment
            </CustomFormLabel>
            <RadioGroup
              row
              aria-label="eventBudget"
              name="eventBudget"
              onChange={(e, newValue) => {
                formik.setFieldValue("eventBudget", newValue);
              }}
              value={formik.values.eventBudget}
            >
              {EVENT_BUDGET_OPTIONS.map((eventBudgetOption) => (
                <FormControlLabel
                  key={eventBudgetOption.id}
                  value={eventBudgetOption.id}
                  control={<CustomRadio color="primary" />}
                  label={eventBudgetOption.label}
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
          </Box>
          <Box>
            <CustomFormLabel htmlFor="referencePlaylistLink">
              Link to your reference playlist (to determine which DJ fits your
              event best)
            </CustomFormLabel>
            <CustomTextField
              id="referencePlaylistLink"
              variant="outlined"
              fullWidth
              value={formik.values.referencePlaylistLink}
              onChange={formik.handleChange}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="marketingType">
              How did you hear about us?
            </CustomFormLabel>
            <RadioGroup
              row
              aria-label="marketingType"
              name="marketingType"
              onChange={(e, newValue) => {
                formik.setFieldValue("marketingType", newValue);
              }}
              value={formik.values.marketingType}
            >
              {MARKETING_TYPE_OPTIONS.map((marketingTypeOption) => (
                <FormControlLabel
                  key={marketingTypeOption.id}
                  value={marketingTypeOption.id}
                  control={<CustomRadio color="primary" />}
                  label={marketingTypeOption.label}
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
            {formik.values.marketingType === "other" && (
              <CustomTextField
                id="otherMarketingType"
                variant="outlined"
                fullWidth
                value={formik.values.otherMarketingType}
                onChange={formik.handleChange}
              />
            )}
          </Box>
        </Stack>
        <Box mt={3} mb={1}>
          <Button
            color="primary"
            variant="outlined"
            size="large"
            fullWidth
            type="submit"
          >
            Submit
          </Button>
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </form>
      Thank you for taking the time to fill out this form.
    </>
  );
};

export default GetAQuoteForm;
