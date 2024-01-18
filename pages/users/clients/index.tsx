import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { TabContext, TabPanel } from "@mui/lab";
import React, { Dispatch, SetStateAction, useState } from "react";
// import { getProducts } from "../../../src/store/apps/eCommerce/ECommerceSlice";
import { HeadCell } from "../../../src/components/smart-table/EnhancedTableHead";
import SmartTable from "../../../src/components/smart-table";
import { useRouter } from "next/router";
import buildQueryParams, {
  QueryParams,
} from "../../../src/components/smart-table/utils/buildQueryParams";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import { useFormik } from "formik";
import * as yup from "yup";

type Clients = {
  data: {
    id: number;
    fullName: string;
    email: string;
    verified: boolean;
  }[];
  count: number;
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Clients",
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

const getClients = async (
  setClients: Dispatch<SetStateAction<Clients | undefined>>,
  params: QueryParams
) => {
  const queryParams = buildQueryParams(params);

  // const events = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/events?${queryParams}`
  // );

  setClients({
    data: [
      {
        id: 1,
        fullName: "test",
        email: "test@test.com",
        verified: true,
      },
      {
        id: 1,
        fullName: "test 2",
        email: "test@test.com",
        verified: false,
      },
    ],
    count: 2,
  });
};

const handleDeleteRows = async (
  setClients: Dispatch<SetStateAction<Clients | undefined>>,
  ids: number[],
  setSelected: Dispatch<SetStateAction<number[]>>
) => {
  // await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events`, {
  //   data: JSON.stringify({
  //     ids,
  //   }),
  //   headers: { "Content-Type": "application/json" },
  // });

  setSelected([]);
  await getClients(setClients, {});
};

const Customers = () => {
  const [openTab, setOpenTab] = useState("verified");
  const [clients, setClients] = useState<Clients>();
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setOpenTab(newValue);
  };

  const columns: HeadCell[] = [
    {
      id: "fullName",
      label: "Name",
      sqlColumn: "full_name",
    },
    {
      id: "email",
      label: "Email",
      sqlColumn: "email",
    },
  ];

  const formik = useFormik({
    initialValues: {
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
      phone: yup.string().required("Phone is required"),
    }),
    onSubmit: async (data, { resetForm }) => {
      setOpen(false);
    },
  });

  const handleClose = () => {
    formik.setFieldValue("fullName", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("phone", "");

    setOpen(false);
  };

  return (
    <>
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
                  getData={getClients}
                  handleDeleteRows={handleDeleteRows}
                  handleRowClick={(data) => {
                    formik.setFieldValue("fullName", data.fullName);
                    formik.setFieldValue("email", data.email);
                    formik.setFieldValue("phone", data.phone);

                    setOpen(true);
                  }}
                  data={clients?.data}
                  count={clients?.count || 0}
                  setData={setClients}
                  structureTable={(data) => {
                    return data;
                  }}
                  onCreateClick={() => {
                    setOpen(true);
                  }}
                  columns={columns}
                />
              </TabPanel>
            ))}
          </TabContext>
        </Card>
      </PageContainer>
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
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="fullName">Full Name</CustomFormLabel>
              <CustomTextField
                id="fullName"
                variant="outlined"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
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
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Customers;
