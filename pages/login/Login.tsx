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
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

const AuthLogin = ({ title, subtext }: loginType) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Email must be valid")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (data) => {
      try {
        await login(data.email, data.password);

        router.push(`/`);
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
      <form onSubmit={formik.handleSubmit}>
        <Stack>
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
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remeber Me"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
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
              Sign In
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </Box>
      </form>
    </>
  );
};

export default AuthLogin;
