import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import ErrorSnackbar from "../error/ErrorSnackbar";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { FormikConfig } from "formik";

const UserDialog = ({
  openTab,
  setOpen,
  open,
  formik,
  error,
  setError,
}: {
  openTab?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  formik: any;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleClose = () => {
    formik.setFieldValue("id", null);
    formik.setFieldValue("fullName", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("phone", "");

    formik.setTouched({
      fullName: false,
      phone: false,
    });

    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
        },
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
        <DialogContent>
          <Box>
            <CustomFormLabel htmlFor="fullName">Full Name</CustomFormLabel>
            <CustomTextField
              id="fullName"
              variant="outlined"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              fullWidth
            />
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              id="email"
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
            <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
            <CustomTextField
              id="phone"
              variant="outlined"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          {formik.isSubmitting ? (
            <CircularProgress />
          ) : openTab === "unverified" ? (
            <Button type="submit" autoFocus>
              Approve
            </Button>
          ) : (
            <Button type="submit" autoFocus>
              Confirm
            </Button>
          )}
          <ErrorSnackbar error={error} setError={setError} />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog;
