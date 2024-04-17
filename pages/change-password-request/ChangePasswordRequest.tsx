import { Box, Button, CircularProgress, Stack } from "@mui/material";
import Link from "next/link";
import * as yup from "yup";

import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "../../src/utils/axios";
import ErrorSnackbar from "../../src/components/error/ErrorSnackbar";

const ChangePasswordRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Email must be valid")
        .required("Email is required"),
    }),
    onSubmit: async (data) => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password-reset`,
          JSON.stringify({
            email: data.email,
            token: router.query.token,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        router.push(`/change-password-request-complete`);
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
        <Stack mt={4} spacing={2}>
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
          {formik.isSubmitting ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
            >
              Send
            </Button>
          )}
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
      </form>
      <ErrorSnackbar error={error} setError={setError} />
    </>
  );
};

export default ChangePasswordRequest;
