import React from "react";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const CustomTextField = styled((props: any) => <TextField {...props} />)(
  ({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
      color: theme.palette.text.secondary,
      opacity: "0.8",
    },
    "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
      color: theme.palette.text.secondary,
      opacity: "1",
    },
  })
);

export default CustomTextField;
