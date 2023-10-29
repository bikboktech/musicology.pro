import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  RadioGroup,
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
import React from "react";
import { useFormik } from "formik";

const GetAQuoteForm = () => {
  const [value3, setValue3] = React.useState<Dayjs | null>(
    dayjs("2018-01-01T00:00:00.000Z")
  );

  // const formik = useFormik({
  //   initialValues: {
  //     eventName: values?.eventName || null,
  //     eventType: values?.eventType || {
  //       id: 0,
  //       name: "",
  //     },
  //     client: values?.client || {
  //       id: 0,
  //       fullName: "",
  //     },
  //     eventDate: values?.eventDate || dayjs().add(1, "month"),
  //     guestCount: values?.guestCount || null,
  //     artist: values?.artist || {
  //       id: 0,
  //       fullName: "",
  //     },
  //     location: values?.location || null,
  //     venueName: values?.venueName || null,
  //     venueContact: values?.venueContact || null,
  //     additionalInfo: values?.additionalInfo || null,
  //   },
  //   validationSchema: yup.object({
  //     eventName: yup.string().required("Event name is required"),
  //     eventType: yup.object({
  //       id: yup.number(),
  //       name: yup.string().required("Event type is required"),
  //     }),
  //     client: yup.object({
  //       id: yup.number(),
  //       fullName: yup.string().required("Client is required"),
  //     }),
  //     eventDate: yup.date().required("Event date is required"),
  //     artist: yup.object({
  //       id: yup.number(),
  //       fullName: yup.string().required("Artist is required"),
  //     }),
  //   }),
  //   onSubmit: async (data) => {
  //     try {
  //       if (values?.id) {
  //         const response = await axios.put(
  //           `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${values.id}`,
  //           JSON.stringify({
  //             ...data,
  //             clientId: data?.client?.id,
  //             artistId: data?.artist?.id,
  //             eventTypeId: data?.eventType?.id,
  //           }),
  //           {
  //             headers: { "Content-Type": "application/json" },
  //           }
  //         );

  //         setValues(response.data);

  //         if (setEdit) {
  //           setEdit(false);
  //         }

  //         wizardProps?.handleNext();
  //       } else {
  //         const response = await axios.post(
  //           `${process.env.NEXT_PUBLIC_API_BASE_URL}/events`,
  //           JSON.stringify({
  //             ...data,
  //             clientId: data?.client?.id,
  //             artistId: data?.artist?.id,
  //             eventTypeId: data?.eventType?.id,
  //           }),
  //           {
  //             headers: { "Content-Type": "application/json" },
  //           }
  //         );

  //         setValues(response.data);

  //         wizardProps?.handleNext();
  //       }
  //     } catch (err: any) {
  //       setError(err.response.data);
  //     }
  //   },
  // });

  return (
    <>
      <Typography fontWeight="700" variant="h3" mb={1}>
        EVENT QUESTIONARY
      </Typography>
      Please fill out this form to get as much understanding of how you envision
      your special day.
      <Stack>
        <Box>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField id="email" variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="eventType">Type of Event</CustomFormLabel>
          <RadioGroup
            row
            aria-label="eventType"
            name="eventType"
            defaultValue="wedding"
          >
            <FormControlLabel
              value="wedding"
              control={<CustomRadio color="primary" />}
              label="Wedding"
              labelPlacement="end"
            />
            <FormControlLabel
              value="birthday"
              control={<CustomRadio color="primary" />}
              label="Birthday"
              labelPlacement="end"
            />
            <FormControlLabel
              value="corporateEvent"
              control={<CustomRadio color="primary" />}
              label="Corporate Event"
              labelPlacement="end"
            />
            <FormControlLabel
              value="other"
              control={<CustomRadio color="primary" />}
              label="Other"
              labelPlacement="end"
            />
          </RadioGroup>
        </Box>
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
                  size="small"
                  inputProps={{ "aria-label": "basic date picker" }}
                  {...inputProps}
                />
              )}
              value={value3}
            />
          </LocalizationProvider>
        </Box>
        <Box>
          <CustomFormLabel htmlFor="clientName">
            Client name or bride and groom names
          </CustomFormLabel>
          <CustomTextField id="clientName" variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="guestCount">
            Estimated guest count (number of guests)
          </CustomFormLabel>
          <CustomTextField id="guestCount" variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="eventLocation">
            Event location (venue)
          </CustomFormLabel>
          <CustomTextField id="eventLocation" variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="eventDuration">
            Duration of event
          </CustomFormLabel>
          <RadioGroup
            row
            aria-label="eventDuration"
            name="eventDuration"
            defaultValue="3hours"
          >
            <FormControlLabel
              value="3hours"
              control={<CustomRadio color="primary" />}
              label="Up to 3 hours"
              labelPlacement="end"
            />
            <FormControlLabel
              value="6hours"
              control={<CustomRadio color="primary" />}
              label="Up to 6 hours"
              labelPlacement="end"
            />
            <FormControlLabel
              value="other"
              control={<CustomRadio color="primary" />}
              label="Other"
              labelPlacement="end"
            />
          </RadioGroup>
          <CustomTextField id="otherDuration" variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="budget">
            Planned budget for entertainment
          </CustomFormLabel>
          <RadioGroup
            row
            aria-label="budget"
            name="budget"
            defaultValue="cheapest"
          >
            <FormControlLabel
              value="cheapest"
              control={<CustomRadio color="primary" />}
              label="Cheapest option possible (Entertainment is not a priority for us)"
              labelPlacement="end"
            />
            <FormControlLabel
              value="2-3"
              control={<CustomRadio color="primary" />}
              label="€2.000 - €3.000"
              labelPlacement="end"
            />
            <FormControlLabel
              value="3-6"
              control={<CustomRadio color="primary" />}
              label="€3.000 - €6.000"
              labelPlacement="end"
            />
            <FormControlLabel
              value="6-more"
              control={<CustomRadio color="primary" />}
              label="€6.000 - MORE"
              labelPlacement="end"
            />
          </RadioGroup>
        </Box>
        <Box>
          <CustomFormLabel htmlFor="marketingType">
            How did you hear about us?
          </CustomFormLabel>
          <CustomTextField id="marketingType" variant="outlined" fullWidth />
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
      </Box>
      Thank you for taking the time to fill out this form.
    </>
  );
};

export default GetAQuoteForm;
