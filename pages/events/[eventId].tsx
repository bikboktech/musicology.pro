import * as React from "react";
import PageContainer from "../../src/components/container/PageContainer";
import Breadcrumb from "../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import { Grid, Tabs, Tab, Box, CardContent, Divider } from "@mui/material";

// components
import EventInfo from "../../src/components/events/EventInfo";
import {
  IconCalendarEvent,
  IconFileDescription,
  IconPlaylist,
  IconTimelineEvent,
} from "@tabler/icons-react";
import BlankCard from "../../src/components/shared/BlankCard";
import NotificationTab from "../../src/components/pages/account-setting/NotificationTab";
import BillsTab from "../../src/components/pages/account-setting/BillsTab";
import SecurityTab from "../../src/components/pages/account-setting/SecurityTab";
import EventInfoEdit from "../../src/components/events/EventInfoEdit";
import { EventInfoData } from "../../src/types/events/EventInfoData";
import axios from "axios";
import { useRouter } from "next/router";

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

const Event = () => {
  const [value, setValue] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [eventInfo, setEventInfo] = React.useState<EventInfoData>();
  const router = useRouter();

  React.useEffect(() => {
    if (!eventInfo && router.query.eventId) {
      getEventInfo(router.query.eventId as string, setEventInfo);
    }
  }, [eventInfo, router.query.eventId]);

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
                <NotificationTab />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <BillsTab />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <SecurityTab />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Event;
