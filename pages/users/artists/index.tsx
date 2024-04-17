import { Card, CircularProgress, useMediaQuery, useTheme } from "@mui/material";

import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SmartTable from "../../../src/components/smart-table";
import { HeadCell } from "../../../src/components/smart-table/EnhancedTableHead";
import axios from "../../../src/utils/axios";
import buildQueryParams, {
  QueryParams,
} from "../../../src/components/smart-table/utils/buildQueryParams";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import UserDialog from "../../../src/components/users/UserDialog";

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
  params: QueryParams,
  setLoading?: Dispatch<SetStateAction<boolean>>
) => {
  if (setLoading) {
    setLoading(true);
  }

  const queryParams = buildQueryParams(params);

  const artists = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts?accountTypeId=${ARTIST_ID}&${queryParams}`
  );

  setArtists(artists.data);

  if (setLoading) {
    setLoading(false);
  }
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

    formik.setTouched({
      fullName: false,
      phone: false,
    });

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
      <UserDialog
        open={open}
        setOpen={setOpen}
        error={error}
        setError={setError}
        formik={formik}
      />
    </>
  );
};

export default Artists;
