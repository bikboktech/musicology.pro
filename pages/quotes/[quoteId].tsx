import * as React from "react";
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import {
  Grid,
  Box,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";

// components
import BlankCard from "../../src/components/shared/BlankCard";

import { useRouter } from "next/router";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import axios from "../../src/utils/axios";
import ErrorSnackbar from "../../src/components/error/ErrorSnackbar";
import { useAuth } from "../../context/AuthContext";

type QuoteInfoData = {
  id: number;
  account: {
    id: number;
    fullName: string;
    email: string;
  };
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  extraMusician: string;
  audioSupport: string;
  referencePlaylistLink: string;
  marketingType: string;
  hoursOfEntertainment: string;
  naturalApproachInteractions: string;
  budget: string;
  approved: boolean;
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Quote",
  },
];

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getQuoteInfo = async (
  quoteId: string,
  setQuoteInfo: React.Dispatch<React.SetStateAction<QuoteInfoData | undefined>>
) => {
  const quote = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/${quoteId}`
  );

  setQuoteInfo(quote.data);
};

const Quote = () => {
  const [quoteInfo, setQuoteInfo] = React.useState<QuoteInfoData>();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  React.useEffect(() => {
    if (user && !quoteInfo && router.query.quoteId) {
      getQuoteInfo(router.query.quoteId as string, setQuoteInfo);
    }
  }, [user, quoteInfo, router.query.quoteId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const approveQuote = async () => {
    if (quoteInfo) {
      setLoading(true);
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/${quoteInfo.id}`,
          JSON.stringify({
            approved: true,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setQuoteInfo(response.data);

        router.push(`/events/${response.data.eventId}`);
      } catch (err: any) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Quote" items={BCrumb} />
      {/* end breadcrumb */}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {quoteInfo ? (
            <BlankCard>
              <Box sx={{ maxWidth: { xs: 1320, sm: 1480 } }}>
                <Grid container spacing={3}>
                  {/* Edit Details */}
                  <Grid item xs={12}>
                    <BlankCard>
                      <CardContent>
                        <form>
                          <Grid container spacing={3}>
                            <Grid item xs={8} sm={10}>
                              <Typography variant="h5" mb={1}>
                                {`Quote - ${quoteInfo.id}`}
                              </Typography>
                              <Typography color="textSecondary" mb={3}>
                                To approve the Quote and create an Event click
                                Approve
                              </Typography>
                            </Grid>
                            {!quoteInfo.approved && (
                              <Grid item xs={4} sm={2}>
                                {!loading ? (
                                  <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    onClick={approveQuote}
                                  >
                                    Approve
                                  </Button>
                                ) : (
                                  <CircularProgress />
                                )}
                              </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                              <CustomFormLabel
                                sx={{
                                  mt: 0,
                                }}
                                htmlFor="text-client"
                              >
                                Client Name
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.account.fullName}
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
                                Email
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.account.email}
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
                                {quoteInfo.eventDate as string}
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
                                Location
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.eventLocation}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {/* 7 */}
                              <CustomFormLabel
                                sx={{
                                  mt: 0,
                                }}
                                htmlFor="text-additional-info"
                              >
                                Budget
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.budget}
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
                                {quoteInfo.guestCount}
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
                                Extra Musicians
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.extraMusician}
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
                                Audio Support
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.audioSupport ? "Yes" : "No"}
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
                                Reference Playlist Link
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.referencePlaylistLink}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {/* 7 */}
                              <CustomFormLabel
                                sx={{
                                  mt: 0,
                                }}
                                htmlFor="text-additional-info"
                              >
                                Heard about us from
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.marketingType}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {/* 7 */}
                              <CustomFormLabel
                                sx={{
                                  mt: 0,
                                }}
                                htmlFor="text-additional-info"
                              >
                                Interactions approach
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.naturalApproachInteractions}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {/* 7 */}
                              <CustomFormLabel
                                sx={{
                                  mt: 0,
                                }}
                                htmlFor="text-additional-info"
                              >
                                Hours of entertainment
                              </CustomFormLabel>
                              <Typography color="textSecondary" mb={3}>
                                {quoteInfo.hoursOfEntertainment}
                              </Typography>
                            </Grid>
                          </Grid>
                        </form>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ justifyContent: "end" }}
                          mt={3}
                        >
                          <Button
                            size="large"
                            variant="outlined"
                            onClick={() => router.push("/quotes")}
                          >
                            Back
                          </Button>
                        </Stack>
                      </CardContent>
                    </BlankCard>
                  </Grid>
                </Grid>
              </Box>
            </BlankCard>
          ) : (
            <CircularProgress />
          )}
        </Grid>
        <ErrorSnackbar error={error} setError={setError} />
      </Grid>
    </PageContainer>
  );
};

export default Quote;
