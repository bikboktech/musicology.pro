import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import { HeadCell } from "./EnhancedTableHead";

interface EnhancedTableBodyProps {
  columns: HeadCell[];
  tableData: {}[];
  selected: readonly string[];
  setSelected: (value: any) => void;
}

export default function EnhancedTableBody(props: EnhancedTableBodyProps) {
  const { columns, tableData, selected, setSelected } = props;

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
      {tableData.map((row: any, index) => {
        const isItemSelected = isSelected(row.name);
        const labelId = `enhanced-table-checkbox-${index}`;

        return (
          <TableRow
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
          >
            <TableCell padding="checkbox">
              <CustomCheckbox
                checked={isItemSelected}
                onClick={(event) => handleCheckboxClick(event, row.name)}
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
      })}
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
