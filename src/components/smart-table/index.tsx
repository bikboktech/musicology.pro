/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from "react";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead, { HeadCell, Order } from "./EnhancedTableHead";
import EnhancedTableBody from "./EnhancedTableBody";
import { Box, Table, TableContainer, TablePagination } from "@mui/material";
import BlankCard from "../../../src/components/shared/BlankCard";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: any[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

const SmartTable = ({
  tableName,
  data,
  structureTable,
  columns,
}: {
  tableName: string;
  data: any[];
  structureTable: (data: any[]) => any[] | undefined;
  columns: HeadCell[];
}) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("calories");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");

  const tableData = useMemo(
    () => (structureTable ? structureTable(data) : data) as any[],
    [data, structureTable]
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof []
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const filteredRows: ProductType[] = getProducts.filter((row) => {
    //   return row.title.toLowerCase().includes(event.target.value);
    // });
    setSearch(event.target.value);
    // setRows(filteredRows);
  };

  return (
    <BlankCard>
      <Box mb={2} sx={{ mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          tableName={tableName}
          handleSearch={(event: any) => handleSearch(event)}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby={tableName}
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              columns={columns}
            />
            <EnhancedTableBody
              columns={columns}
              tableData={tableData}
              selected={selected}
              setSelected={setSelected}
            />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </BlankCard>
  );
};

export default SmartTable;
