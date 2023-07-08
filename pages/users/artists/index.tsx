import { Box, Card, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";

import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import ParentCard from "../../../src/components/shared/ParentCard";
import Table2 from "../../../src/components/tables/Table2";
import Table3 from "../../../src/components/tables/Table3";
import Table1 from "../../../src/components/tables/Table1";
import Table4 from "../../../src/components/tables/Table4";
import Table5 from "../../../src/components/tables/Table5";
import ChildCard from "../../../src/components/shared/ChildCard";
import { TabContext, TabPanel } from "@mui/lab";
import { useState } from "react";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Artists",
  },
];

// const TABS = [
//   {
//     value: "verified",
//     label: "Verified",
//   },
//   {
//     value: "unverified",
//     label: "Unverified",
//   },
// ];

const Artists = () => {
  const [openTab, setOpenTab] = useState("verified");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setOpenTab(newValue);
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Artists" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        {/* <TabContext value={openTab}>
          <Tabs
            value={openTab}
            onChange={handleTabChange}
            aria-label="customers"
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                // icon={tab.icon}
                label={tab.label}
                iconPosition="top"
                value={tab.value}
              />
            ))}
          </Tabs> */}
        {/* {TABS.map((panel) => ( */}
        {/* <TabPanel key={panel.value} value={panel.value}> */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box>
              <Table5 />
            </Box>
          </Grid>
        </Grid>
        {/* </TabPanel> */}
        {/* ))} */}
        {/* </TabContext> */}
      </Card>
    </PageContainer>
  );
};

export default Artists;
