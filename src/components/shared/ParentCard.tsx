import React from "react";
import { useTheme } from "@mui/material/styles";
import { Card, CardHeader, CardContent, Divider, Box } from "@mui/material";
import { useSelector } from "../../../src/store/Store";
import { AppState } from "../../../src/store/Store";

type Props = {
  title: string;
  footer?: string | JSX.Element;
  children: JSX.Element;
  cardStyle?: {};
  removeDivider?: boolean;
};

const ParentCard = ({
  title,
  children,
  footer,
  cardStyle,
  removeDivider,
}: Props) => {
  const customizer = useSelector((state: AppState) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{
        padding: 0,
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
        ...cardStyle,
      }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? "outlined" : undefined}
    >
      <CardHeader title={title} />
      {!removeDivider && <Divider />}

      <CardContent>{children}</CardContent>
      {footer ? (
        <>
          <Divider />
          <Box p={3}>{footer}</Box>
        </>
      ) : (
        ""
      )}
    </Card>
  );
};

export default ParentCard;
