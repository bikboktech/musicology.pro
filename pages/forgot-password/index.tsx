import { Grid, Box, Typography } from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import ForgotPassword from "./ForgotPassword";

const ForgotPasswordPage = () => (
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
          <Typography variant="h4" fontWeight="700">
            Forgot your password?
          </Typography>

          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="400"
            mt={2}
          >
            Please enter the email address associated with your account and We
            will email you a link to reset your password.
          </Typography>
          <ForgotPassword />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

ForgotPasswordPage.layout = "Blank";
export default ForgotPasswordPage;
