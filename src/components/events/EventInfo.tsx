import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";

// components
import BlankCard from "../shared/BlankCard";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomSelect from "../forms/theme-elements/CustomSelect";

// images
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { EventInfoData } from "../../types/events/EventInfoData";

const EventInfo = ({
  setEdit,
  values,
  setValues,
}: {
  setEdit: Dispatch<SetStateAction<boolean>>;
  values: EventInfoData | undefined;
  setValues: Dispatch<SetStateAction<EventInfoData | undefined>>;
}) => {
  const router = useRouter();

  console.log(values);

  return values ? (
    <Grid container spacing={3}>
      {/* Edit Details */}
      <Grid item xs={12}>
        <BlankCard>
          <CardContent>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={8} sm={10}>
                  <Typography variant="h5" mb={1}>
                    {values.eventName}
                  </Typography>
                  <Typography color="textSecondary" mb={3}>
                    To change your event detail, click on Edit
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
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-client"
                  >
                    Client
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.client.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 2 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-artist"
                  >
                    Artist
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.artist.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 3 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-event-date"
                  >
                    Event Date
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.eventDate as string}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 4 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-event-type"
                  >
                    Event Type
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.eventType.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 5 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-guest-count"
                  >
                    Guest count
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.guestCount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 6 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-location"
                  >
                    Location
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 5 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-venue-name"
                  >
                    Venue name
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.venueName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 6 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-venue-contact"
                  >
                    Venue contact
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.venueContact}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {/* 7 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-additional-info"
                  >
                    Additional info
                  </CustomFormLabel>
                  <Typography color="textSecondary" mb={3}>
                    {values.additionalInfo}
                  </Typography>
                </Grid>
              </Grid>
            </form>
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
  ) : (
    <CircularProgress />
  );
};

export default EventInfo;
