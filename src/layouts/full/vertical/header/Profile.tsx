import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Icon,
} from "@mui/material";
import * as dropdownData from "./data";

import { IconMail, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import { useAuth } from "../../../../../context/AuthContext";
import { useRouter } from "next/router";
import * as yup from "yup";
import UserDialog from "../../../../components/users/UserDialog";
import axios from "../../../../utils/axios";
import { useFormik } from "formik";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [open, setOpen] = useState<boolean>(false);
  const { user, logout, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      id: null,
      fullName: "",
      email: "",
      phone: "",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Name is required"),
      email: yup
        .string()
        .email("Email must be valid")
        .required("Email is required"),
    }),
    onSubmit: async (data) => {
      try {
        if (user) {
          const updatedUser = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/${data.id}`,
            JSON.stringify({
              ...data,
              accountTypeId: user.accountType.id,
              active: true,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setUser(updatedUser.data);
        }

        handleClose();
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

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

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    router.push("/login");

    logout();
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <IconUserCircle width={35} height={35} />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Box>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              fontWeight={600}
            >
              {user?.fullName}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.accountType.name}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {user?.email}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {dropdownData.profile.slice(0, 1).map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Stack direction="row" spacing={2}>
                <Box
                  width="45px"
                  height="45px"
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    onClick={() => {
                      if (user) {
                        formik.setFieldValue("id", user.id);
                        formik.setFieldValue("fullName", user.fullName);
                        formik.setFieldValue("email", user.email);
                        formik.setFieldValue("phone", user.phone);

                        setOpen(true);
                      }
                    }}
                  >
                    <IconSettings />
                  </IconButton>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="textPrimary"
                    className="text-hover"
                    noWrap
                    sx={{
                      width: "240px",
                    }}
                  >
                    {profile.title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{
                      width: "240px",
                    }}
                    noWrap
                  >
                    {profile.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        ))}
        <UserDialog
          open={open}
          setOpen={setOpen}
          error={error}
          setError={setError}
          formik={formik}
        />
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
