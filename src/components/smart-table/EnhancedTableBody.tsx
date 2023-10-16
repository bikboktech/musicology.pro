import {
  CircularProgress,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import { HeadCell } from "./EnhancedTableHead";

interface EnhancedTableBodyProps {
  columns: HeadCell[];
  tableData: {}[];
  handleRowClick: (data: any) => void;
  selected: readonly number[];
  setSelected: (value: any) => void;
}

export default function EnhancedTableBody(props: EnhancedTableBodyProps) {
  const { columns, handleRowClick, tableData, selected, setSelected } = props;

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    id: number
  ) => {
    event.stopPropagation();

    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  return (
    <TableBody>
      {tableData ? (
        tableData.map((row: any, index) => {
          const isItemSelected = isSelected(row.id);
          const labelId = `enhanced-table-checkbox-${index}`;

          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              onClick={() => handleRowClick(row)}
              tabIndex={-1}
              key={row.id}
              sx={{ cursor: "pointer" }}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <CustomCheckbox
                  checked={isItemSelected}
                  onClick={(event) => handleCheckboxClick(event, row.id)}
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </TableCell>
              {columns.map((column) => {
                return (
                  <TableCell>
                    {column.render ? (
                      column.render(row[column.id], row)
                    ) : (
                      <Typography
                      //   color="textSecondary"
                      //   variant="subtitle2"
                      //   fontWeight="400"
                      >
                        {row[column.id]}
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <CircularProgress />
        </TableRow>
      )}
      {/* {emptyRows > 0 && (
        <TableRow
          style={{
            height: (dense ? 33 : 53) * emptyRows,
          }}
        >
          <TableCell colSpan={6} />
        </TableRow>
      )} */}
    </TableBody>
  );
}
