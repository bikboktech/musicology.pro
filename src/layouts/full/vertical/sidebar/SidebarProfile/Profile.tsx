import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "../../../../../store/Store";
import { IconPower } from "@tabler/icons-react";
import { AppState } from "../../../../../store/Store";
import Link from "next/link";
import { useAuth } from "../../../../../../context/AuthContext";
import { useRouter } from "next/router";

export const Profile = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const { user, logout } = useAuth();
  const router = useRouter();

  const hideMenu = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";

  const handleLogout = () => {
    router.push("/login");

    logout();
  };

  return (
    <Box
      display={"flex"}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${"secondary.light"}` }}
    >
      {!hideMenu ? (
        <>
          <Box>
            <Typography variant="h6">{user?.fullName}</Typography>
            <Typography variant="caption">{user?.accountType.name}</Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                aria-label="logout"
                onClick={handleLogout}
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
