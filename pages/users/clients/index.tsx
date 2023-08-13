import {
  Avatar,
  Box,
  Card,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { TabContext, TabPanel } from "@mui/lab";
import React, { useState } from "react";
import SmartTable from "../../../src/components/smart-table";
import {
  EnTableType,
  EnhancedTableData,
} from "../../../src/components/tables/tableData";
import { getProducts } from "../../../src/store/apps/eCommerce/ECommerceSlice";
import { HeadCell } from "../../../src/components/smart-table/EnhancedTableHead";

type TestData = {
  name: string;
  email: string;
  phone: string;
}[];

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Artists",
  },
];

const TABS = [
  {
    value: "verified",
    label: "Verified",
  },
  {
    value: "unverified",
    label: "Unverified",
  },
];

const testData: TestData = [
  {
    name: "Matej Paus",
    email: "mpaus@hotmail.com",
    phone: "099 721 4993",
  },
  {
    name: "Andrea Hrelja",
    email: "ahrelja@hotmail.com",
    phone: "098 444 4993",
  },
  {
    name: "Manuel Lupen",
    email: "mlupen@hotmail.com",
    phone: "091 721 5555",
  },
];

const Customers = () => {
  const [openTab, setOpenTab] = useState("verified");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setOpenTab(newValue);
  };

  const [rows, setRows] = React.useState<any>(getProducts);

  const structureRows = (testData: TestData): any[] => {
    const rowOutput = testData.map((data) => [
      {
        render: (data: any) => (
          <Stack spacing={2} direction="row">
            <Avatar
              alt="text"
              src={data.imgsrc}
              sx={{
                width: "35px",
                height: "35px",
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight="600">
                {data.name}
              </Typography>
              <Typography color="textSecondary" variant="subtitle2">
                {data.email}
              </Typography>
            </Box>
          </Stack>
        ),
      },
    ]);

    return rowOutput;
  };

  const columns: HeadCell[] = [
    {
      id: "name",
      label: "Client name",
    },
    {
      id: "email",
      label: "Email",
    },
    {
      id: "phone",
      label: "Phone",
    },
  ];

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Clients" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <TabContext value={openTab}>
          <Tabs
            value={openTab}
            onChange={handleTabChange}
            aria-label="clients"
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
          </Tabs>
          {TABS.map((panel) => (
            <TabPanel key={panel.value} value={panel.value}>
              <SmartTable
                tableName="Clients"
                data={testData}
                structureTable={(data) => {
                  return data;
                }}
                columns={columns}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Card>
    </PageContainer>
  );
};

export default Customers;
