import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import { visuallyHidden } from "@mui/utils";

export type Order = "asc" | "desc";

export interface HeadCell {
  id: any;
  label: string;
  sqlColumn?: string;
  render?: (value: any, row: any) => any;
}

interface EnhancedTableProps {
  columns: HeadCell[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export default function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
  } = props;
  const createSortHandler =
    (property: keyof []) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            tabIndex={-1}
            inputProps={{
              "aria-labelledby": "select all desserts",
            }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            // align={headCell.numeric ? "right" : "left"}
            // padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              <Typography variant="h6">{column.label}</Typography>
              {orderBy === column.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
