import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Alert,
  Grid,
  Autocomplete,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  useTheme,
  Paper,
  CardHeader,
  Divider,
  List,
  RadioGroup,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Link,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import Scrollbar from "../../src/components/custom-scroll/Scrollbar";

const TimelineComponent = () => {
  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 0px",
        }}
      >
        <Button variant="outlined" startIcon={<IconPlus width={18} />}>
          Add Event
        </Button>
        <Button variant="outlined" startIcon={<IconTrash width={18} />}>
          Clear
        </Button>
      </div>
      <Stack sx={{ border: "1px solid #FFFFFF", borderRadius: "7px" }}>
        <Scrollbar
          sx={{
            // height: { lg: "calc(100vh - 300px)", sm: "100vh" },
            maxHeight: "700px",
          }}
        >
          <Timeline
            className="theme-timeline"
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            sx={{
              p: 0,
              mb: "-40px",
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.5,
                paddingLeft: 0,
              },
            }}
          >
            <TimelineItem>
              <TimelineOppositeContent sx={{ m: "auto 0" }}>
                09:30 am
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  p={2}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    mb: 1,
                    transition: "0.1s ease-in",
                    // transform:
                    //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                    transform: "scale(0.95)",
                    backgroundColor: `primary.light`,
                    maxWidth: "300px",
                  }}
                  // onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    color={"primary.main"}
                    sx={{ paddingBottom: "5px" }}
                  >
                    Opening song
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">
                      Song: Ej, otkad sam se rodio
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        // onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="caption">
                    Instructions: Shoot at the ceiling
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent sx={{ m: "auto 0" }}>
                10:00 am
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  p={2}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    mb: 1,
                    transition: "0.1s ease-in",
                    // transform:
                    //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                    transform: "scale(0.95)",
                    backgroundColor: `primary.light`,
                    maxWidth: "300px",
                  }}
                  // onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    color={"primary.main"}
                    sx={{ paddingBottom: "5px" }}
                  >
                    First dance
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">
                      Song: Bojna Cavoglave
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        // onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="caption">Instructions: None</Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>12:00 am</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="success" variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  p={2}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    mb: 1,
                    transition: "0.1s ease-in",
                    // transform:
                    //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                    transform: "scale(0.95)",
                    backgroundColor: `primary.light`,
                    maxWidth: "300px",
                  }}
                  // onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    color={"primary.main"}
                    sx={{ paddingBottom: "5px" }}
                  >
                    Walking to altar
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">
                      Song: Rocky theme song
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        // onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="caption">
                    Instructions: Don't let the groom escape
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>09:30 am</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="warning" variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  p={2}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    mb: 1,
                    transition: "0.1s ease-in",
                    // transform:
                    //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                    transform: "scale(0.95)",
                    backgroundColor: `primary.light`,
                    maxWidth: "300px",
                  }}
                  // onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    color={"primary.main"}
                    sx={{ paddingBottom: "5px" }}
                  >
                    Opening song
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">
                      Song: Ej, otkad sam se rodio
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        // onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="caption">
                    Instructions: Shoot at the ceiling
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>09:30 am</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="error" variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  p={2}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    mb: 1,
                    transition: "0.1s ease-in",
                    // transform:
                    //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                    transform: "scale(0.95)",
                    backgroundColor: `primary.light`,
                    maxWidth: "300px",
                  }}
                  // onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    color={"primary.main"}
                    sx={{ paddingBottom: "5px" }}
                  >
                    Opening song
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">
                      Song: Ej, otkad sam se rodio
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        // onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="caption">
                    Instructions: Shoot at the ceiling
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>12:00 am</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="success" variant="outlined" />
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  p={2}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    mb: 1,
                    transition: "0.1s ease-in",
                    // transform:
                    //   activeNote === note.id ? "scale(1)" : "scale(0.95)",
                    transform: "scale(0.95)",
                    backgroundColor: `primary.light`,
                    maxWidth: "300px",
                  }}
                  // onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    color={"primary.main"}
                    sx={{ paddingBottom: "5px" }}
                  >
                    Opening song
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption">
                      Song: Ej, otkad sam se rodio
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        // onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="caption">
                    Instructions: Shoot at the ceiling
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Scrollbar>
      </Stack>
    </Box>
  );
};

export default TimelineComponent;
