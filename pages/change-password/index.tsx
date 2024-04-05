import { Grid, Box, Typography } from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import ChangePassword from "./ChangePassword";

const ChangePasswordPage = () => (
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
              src={"/images/backgrounds/musicologypro-2.png"}
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
            Insert your new password
          </Typography>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="400"
            mt={2}
          >
            Type your new password into the inputs below
          </Typography>

          <ChangePassword />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

ChangePasswordPage.layout = "Blank";
export default ChangePasswordPage;
