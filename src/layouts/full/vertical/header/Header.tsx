import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "../../../../store/Store";
import {
  toggleSidebar,
  toggleMobileSidebar,
} from "../../../../store/customizer/CustomizerSlice";
import { IconMenu2 } from "@tabler/icons-react";
import Profile from "./Profile";
import { AppState } from "../../../../store/Store";
import { useAuth } from "../../../../../context/AuthContext";

const ARTIST_ID = 2;

const Header = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const { user } = useAuth();
  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={
            lgUp
              ? () => dispatch(toggleSidebar())
              : () => dispatch(toggleMobileSidebar())
          }
        >
          <IconMenu2 size="20" />
        </IconButton>
        {user?.accountType.id !== ARTIST_ID && (
          <Box style={{ paddingLeft: "10px" }}>
            <div style={{ color: "white", width: "100%" }}>
              <a
                href={"https://musicologyentertainment.com/dwk"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography variant="h6">DWK</Typography>
              </a>
            </div>
          </Box>
        )}
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
