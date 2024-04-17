import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "../../src/types/auth/auth";
import CustomCheckbox from "../../src/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../src/components/forms/theme-elements/CustomFormLabel";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../../src/utils/axios";
import { useState } from "react";
import ErrorSnackbar from "../../src/components/error/ErrorSnackbar";
import { useRouter } from "next/router";

const ChangePassword = ({ title, subtext }: loginType) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      password: yup.string().required("Password is required"),
      confirmPassword: yup.string().required("Password is required"),
    }),
    onSubmit: async (data) => {
      if (data.password !== data.confirmPassword) {
        setError("Passwords are not matching. Try again");

        return;
      }

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/password`,
          JSON.stringify({
            password: data.password,
            token: router.query.token,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        router.push(`/reset-password-complete`);
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1} textAlign="center">
          {title}
        </Typography>
      ) : null}

      {subtext}
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
        <Stack mb={2}>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="confirmPassword">
              Confirm Password
            </CustomFormLabel>
            <CustomTextField
              id="confirmPassword"
              type="password"
              variant="outlined"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              fullWidth
            />
          </Box>
        </Stack>
        <Box>
          {formik.isSubmitting ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              variant="outlined"
              size="large"
              fullWidth
              type="submit"
            >
              Submit
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </form>
    </>
  );
};

export default ChangePassword;
