import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ErrorSnackbar = ({
  error,
  setError,
}: {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}) => {
  const handleClose = () => {
    setError(null);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={!!error}
      autoHideDuration={6000}
      key={"snackbarError"}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%", lineHeight: "1.334rem" }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
