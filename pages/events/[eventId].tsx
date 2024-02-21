import * as React from "react";
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import {
  Grid,
  Tabs,
  Tab,
  Box,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";

// components
import EventInfo from "../../src/components/events/EventInfo";
import {
  IconCalendarEvent,
  IconFileDescription,
  IconPlaylist,
  IconTimelineEvent,
} from "@tabler/icons-react";
import BlankCard from "../../src/components/shared/BlankCard";
import EventInfoEdit from "../../src/components/events/EventInfoEdit";
import { EventInfoData } from "../../src/types/events/EventInfoData";
import axios from "../../src/utils/axios";
import { useRouter } from "next/router";
import { PlaylistInfoData } from "../../src/types/playlist/PlaylistInfoData";
import PlaylistEdit from "../../src/components/playlists/PlaylistEdit";
import PlaylistInfo from "../../src/components/playlists/PlaylistInfo";
import TimelineEdit from "../../src/components/timeline/TimelineEdit";
import TimelineInfo from "../../src/components/timeline/TimelineInfo";
import { TimelineData } from "../../src/types/timeline/TimelineData";
import { useAuth } from "../../context/AuthContext";
import ContractInfo from "../../src/components/contract/ContractInfo";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Event",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getEventInfo = async (
  eventId: string,
  setEventInfo: React.Dispatch<React.SetStateAction<EventInfoData | undefined>>
) => {
  const event = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}`
  );

  setEventInfo(event.data);
};

const getPlaylist = async (
  eventId: string,
  setPlaylistInfo: React.Dispatch<
    React.SetStateAction<PlaylistInfoData | undefined>
  >
) => {
  const playlist = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${eventId}`
  );

  setPlaylistInfo(playlist.data);
};

const getTimeline = async (
  eventId: string,
  setTimelineInfo: React.Dispatch<
    React.SetStateAction<TimelineData[] | undefined>
  >
) => {
  const timelines = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/timelines/${eventId}`
  );

  setTimelineInfo(
    timelines.data
      .map((timeline: TimelineData) => ({
        ...timeline,
        time: dayjs(timeline.time),
      }))
      .sort((cardA: TimelineData, cardB: TimelineData) => {
        if (cardA.time < cardB.time) {
          return -1;
        }
        if (cardA.time > cardB.time) {
          return 1;
        }
        return 0;
      })
  );
};

const Event = () => {
  const [value, setValue] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [eventInfo, setEventInfo] = React.useState<EventInfoData>();
  const [playlistInfo, setPlaylistInfo] = React.useState<PlaylistInfoData>();
  const [timelineInfo, setTimelineInfo] = React.useState<TimelineData[]>();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  React.useEffect(() => {
    if (user && !eventInfo && router.query.eventId) {
      getEventInfo(router.query.eventId as string, setEventInfo);
    }
  }, [user, eventInfo, router.query.eventId]);

  React.useEffect(() => {
    if (user && !playlistInfo && eventInfo?.id) {
      getPlaylist(router.query.eventId as string, setPlaylistInfo);
    }
  }, [user, eventInfo, value]);

  React.useEffect(() => {
    if (user && !timelineInfo && eventInfo?.id) {
      getTimeline(router.query.eventId as string, setTimelineInfo);
    }
  }, [user, timelineInfo, value]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Event" items={BCrumb} />
      {/* end breadcrumb */}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ maxWidth: { xs: 1320, sm: 1480 } }}>
              <Tabs
                value={value}
                onChange={handleChange}
                scrollButtons="auto"
                aria-label="basic tabs example"
                variant="scrollable"
              >
                <Tab
                  iconPosition="start"
                  icon={<IconCalendarEvent size="22" />}
                  label="Event info"
                  {...a11yProps(0)}
                />

                <Tab
                  iconPosition="start"
                  icon={<IconPlaylist size="22" />}
                  label="Playlist"
                  {...a11yProps(1)}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconTimelineEvent size="22" />}
                  label="Timeline"
                  {...a11yProps(2)}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconFileDescription size="22" />}
                  label="Contract"
                  {...a11yProps(3)}
                />
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                {edit ? (
                  <EventInfoEdit
                    values={eventInfo}
                    setValues={setEventInfo}
                    setEdit={setEdit}
                  />
                ) : (
                  <EventInfo
                    setEdit={setEdit}
                    values={eventInfo}
                    setValues={setEventInfo}
                  />
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                {edit ? (
                  <PlaylistEdit
                    values={playlistInfo}
                    setValues={setPlaylistInfo}
                    setEdit={setEdit}
                    eventId={eventInfo?.id}
                  />
                ) : (
                  <PlaylistInfo
                    setEdit={setEdit}
                    values={playlistInfo}
                    setValues={setPlaylistInfo}
                  />
                )}
              </TabPanel>
              <TabPanel value={value} index={2}>
                {edit ? (
                  <TimelineEdit
                    values={timelineInfo}
                    setValues={setTimelineInfo}
                    setEdit={setEdit}
                    eventPlaylist={playlistInfo}
                    eventId={eventInfo?.id as number | undefined}
                  />
                ) : (
                  <TimelineInfo
                    setEdit={setEdit}
                    values={timelineInfo}
                    eventName={eventInfo?.eventName}
                  />
                )}
              </TabPanel>
              <TabPanel value={value} index={3}>
                <ContractInfo values={eventInfo} setValues={setEventInfo} />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Event;
