import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SmartTable from "../../../src/components/smart-table";
import { HeadCell } from "../../../src/components/smart-table/EnhancedTableHead";
import axios from "../../../src/utils/axios";
import buildQueryParams, {
  QueryParams,
} from "../../../src/components/smart-table/utils/buildQueryParams";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorSnackbar from "../../../src/components/error/ErrorSnackbar";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

type Artist = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
};

type Artists = {
  data: Artist[];
  count: number;
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Artists",
  },
];

const ARTIST_ID = 2;

const getArtists = async (
  setArtists: Dispatch<SetStateAction<Artists | undefined>>,
  params: QueryParams
) => {
  const queryParams = buildQueryParams(params);

  const artists = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts?accountTypeId=${ARTIST_ID}&${queryParams}`
  );

  setArtists(artists.data);
};

const handleDeleteRows = async (
  setArtists: Dispatch<SetStateAction<Artists | undefined>>,
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

  await getArtists(setArtists, {});
};

const Artists = () => {
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [artists, setArtists] = useState<Artists>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

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
              accountTypeId: ARTIST_ID,
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
              accountTypeId: ARTIST_ID,
              active: true,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        await getArtists(setArtists, {});

        handleClose();
      } catch (err: any) {
        setError(err.response.data);
      }
    },
  });

  if (isLoading) {
    return <CircularProgress />;
  }

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

  const handleClose = () => {
    formik.setFieldValue("id", null);
    formik.setFieldValue("fullName", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("phone", "");

    setOpen(false);
  };

  return (
    <>
      <PageContainer>
        {/* breadcrumb */}
        <Breadcrumb title="Artists" items={BCrumb} />
        {/* end breadcrumb */}
        <Card>
          <SmartTable
            tableName="Artists"
            getData={getArtists}
            handleDeleteRows={handleDeleteRows}
            handleRowClick={(data) => {
              formik.setFieldValue("id", data.id);
              formik.setFieldValue("fullName", data.fullName);
              formik.setFieldValue("email", data.email);
              formik.setFieldValue("phone", data.phone);

              setOpen(true);
            }}
            data={artists?.data}
            count={artists?.count || 0}
            setData={setArtists}
            structureTable={(data) => {
              return data;
            }}
            onCreateClick={() => {
              setOpen(true);
            }}
            columns={columns}
          />
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

export default Artists;
