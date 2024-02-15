import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { getProducts } from "../../../src/store/apps/eCommerce/ECommerceSlice";
import { HeadCell } from "../../../src/components/smart-table/EnhancedTableHead";
import SmartTable from "../../../src/components/smart-table";
import buildQueryParams, {
  QueryParams,
} from "../../../src/components/smart-table/utils/buildQueryParams";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../../../src/utils/axios";
import ErrorSnackbar from "../../../src/components/error/ErrorSnackbar";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

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

const CLIENT_ID = 3;

const Customers = () => {
  const [openTab, setOpenTab] = useState("verified");
  const [clients, setClients] = useState<Clients>();
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

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
    {
      id: "phone",
      label: "Phone",
      sqlColumn: "phone",
    },
  ];

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
        if (data.id) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/${data.id}`,
            JSON.stringify({
              ...data,
              accountTypeId: CLIENT_ID,
              active: true,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts`,
            JSON.stringify({
              ...data,
              accountTypeId: CLIENT_ID,
              active: true,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        await getClients(setClients, {});

        handleClose();
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleClose = () => {
    formik.setFieldValue("id", null);
    formik.setFieldValue("fullName", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("phone", "");

    setOpen(false);
  };

  const getClients = async (
    setClients: Dispatch<SetStateAction<Clients | undefined>>,
    params: QueryParams
  ) => {
    const queryParams = buildQueryParams(params);

    const clients = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/accounts?accountTypeId=${CLIENT_ID}&active=${
        openTab === "verified" ? "true" : "false"
      }&${queryParams}`
    );

    setClients(clients.data);
  };

  const handleDeleteRows = async (
    setClients: Dispatch<SetStateAction<Clients | undefined>>,
    ids: number[],
    setSelected: Dispatch<SetStateAction<number[]>>
  ) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts`, {
      data: JSON.stringify({
        ids,
      }),
      headers: { "Content-Type": "application/json" },
    });

    setSelected([]);
    await getClients(setClients, {});
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
                    formik.setFieldValue("id", data.id);
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
                disabled={openTab === "unverified"}
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
                disabled={openTab === "unverified"}
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
                disabled={openTab === "unverified"}
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
    </>
  );
};

export default Customers;
