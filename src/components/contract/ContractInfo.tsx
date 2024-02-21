import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { EventInfoData } from "../../types/events/EventInfoData";
import axios from "../../utils/axios";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { AxiosResponse } from "axios";
import ErrorSnackbar from "../error/ErrorSnackbar";
import { EventWizardProps } from "../../types/eventWizard/EventWizardProps";

interface SignWellEmbed {
  new (config: {
    url: string;
    containerId: string;
    events: { completed: (e: any) => void; closed: (e: any) => void };
  }): {
    open: () => void;
    close?: () => void;
  };
}

declare const SignWellEmbed: SignWellEmbed;

type Contract = {
  id: string;
  url: string;
  signed: boolean;
};

const FinalStepButtons = ({
  wizardProps,
}: {
  wizardProps: EventWizardProps;
}) => {
  return (
    <Box display="flex" flexDirection="row" mt={3}>
      <Button
        variant="outlined"
        disabled={wizardProps.activeStep === 0}
        onClick={wizardProps.handleBack}
        sx={{ mr: 1 }}
      >
        Back
      </Button>
      <Box flex="1 1 auto" />
      {wizardProps.isStepOptional(wizardProps?.activeStep) && (
        <Button
          color="inherit"
          onClick={wizardProps?.handleSkip}
          sx={{ mr: 1 }}
        >
          Skip
        </Button>
      )}
      <Button variant="contained" onClick={() => wizardProps.handleNext()}>
        {wizardProps.activeStep === wizardProps.steps.length
          ? "Finish"
          : "Next"}
      </Button>
    </Box>
  );
};

const signContract = async (
  contract: Contract,
  values: EventInfoData,
  setValues: Dispatch<SetStateAction<EventInfoData | undefined>>
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/contracts/${contract.id}`,
    JSON.stringify({
      signed: true,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  setValues({
    ...values,
    contract: {
      ...contract,
      signed: response.data.signed,
    },
  });
};

const ContractInfo = ({
  wizardProps,
  values,
  setValues,
}: {
  wizardProps?: EventWizardProps;
  values: EventInfoData | undefined;
  setValues: Dispatch<SetStateAction<EventInfoData | undefined>>;
}) => {
  const [signedContract, setSignedContract] = React.useState(
    values?.contract?.signed
  );
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (values?.contract?.id && !signedContract) {
      var signWellEmbed = new SignWellEmbed({
        url: values.contract.url,
        containerId: "signWellEmbedContainer",
        events: {
          completed: async () => {
            await signContract(
              values.contract as Contract,
              values as EventInfoData,
              setValues
            );
          },
          closed: () => {
            if (values.contract?.signed) {
              wizardProps?.handleNext();

              setSignedContract(true);
            }
          },
        },
      });

      signWellEmbed.open();

      return () => {
        signWellEmbed.close?.();
      };
    }
  }, [values?.contract]);

  const downloadContract = async (contract: Contract) => {
    setLoading(true);

    try {
      const response = (await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contracts/${contract.id}/pdf`,
        {
          responseType: "blob",
        }
      )) as AxiosResponse;

      const contentDisposition = response.headers["content-disposition"];

      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);

      const filename = filenameMatch ? filenameMatch[1] : "contract.pdf";

      const blob = await response.data;

      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a") as HTMLAnchorElement;

      link.href = url;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response.data);
    }

    setLoading(false);
  };

  if (signedContract) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          You have signed the contract. Click here to download it:
        </Grid>
        <Grid item xs={12} sm={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              size="large"
              variant="outlined"
              color="primary"
              onClick={() => downloadContract(values?.contract as Contract)}
            >
              Download
            </Button>
          )}
        </Grid>
        {wizardProps && <FinalStepButtons wizardProps={wizardProps} />}
        <ErrorSnackbar error={error} setError={setError} />
      </Grid>
    );
  } else if (!signedContract) {
    return (
      <>
        <div id="signWellEmbedContainer" style={{ height: "500px" }} />{" "}
        {wizardProps && <FinalStepButtons wizardProps={wizardProps} />}
      </>
    );
  }

  return (
    <>
      <div>Contract doesn't exist</div>
      {wizardProps && <FinalStepButtons wizardProps={wizardProps} />}
    </>
  );
};

export default ContractInfo;
