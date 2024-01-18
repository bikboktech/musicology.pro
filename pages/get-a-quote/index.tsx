import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";

// components
import PageContainer from "../../src/components/container/PageContainer";
import GetAQuoteForm from "./GetAQuoteForm";

const GetAQuote = () => {
  return (
    <PageContainer>
      <Box
        sx={{
          boxShadow: "none",
          position: "relative",
          "&:before": {
            content: '""',
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{
                p: 4,
                zIndex: 1,
                width: "100%",
                boxShadow: "none",
              }}
            >
              <GetAQuoteForm />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

GetAQuote.layout = "Blank";
export default GetAQuote;
