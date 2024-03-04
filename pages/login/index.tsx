import Link from "next/link";
import { Grid, Box, Stack, Typography } from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import Login from "./Login";
import Image from "next/image";

const LoginPage = () => (
  <PageContainer>
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
        lg={7}
        xl={8}
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "#000000",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
          },
        }}
      >
        <Box position="relative">
          <Box
            alignItems="center"
            justifyContent="center"
            height={"calc(100vh - 75px)"}
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
          >
            <img
              src={"/images/backgrounds/login-background.jpg"}
              alt="bg"
              style={{
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Grid>
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
        <Box p={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Image
              src="/images/logos/musicology-logo.webp"
              alt="logo"
              height={145}
              width={174}
              priority
            />
          </Box>
          <Login
            title="Welcome to Musicology.pro"
            subtext={
              <Typography
                variant="subtitle1"
                color="textSecondary"
                mb={1}
                textAlign="center"
              >
                Your Event management dashboard
              </Typography>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

LoginPage.layout = "Blank";
export default LoginPage;
