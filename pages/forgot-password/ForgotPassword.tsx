import { Button, Stack } from "@mui/material";
import Link from "next/link";

import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";

const ForgotPassword = () => (
  <>
    <Stack mt={4} spacing={2}>
      <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
      <CustomTextField id="reset-email" variant="outlined" fullWidth />

      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/"
      >
        Forgot Password
      </Button>
      <Button
        color="primary"
        variant="outlined"
        size="large"
        fullWidth
        sx={{
          "&:hover": {
            backgroundColor: "#CACACA",
          },
        }}
        component={Link}
        href="/login"
      >
        Back to Login
      </Button>
    </Stack>
  </>
);

export default ForgotPassword;
