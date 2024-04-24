/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo } from "react";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead, { HeadCell, Order } from "./EnhancedTableHead";
import EnhancedTableBody from "./EnhancedTableBody";
import {
  Box,
  CircularProgress,
  Table,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  debounce,
} from "@mui/material";
import BlankCard from "../../../src/components/shared/BlankCard";
import { TableParams } from "../../types/smartTable/TableParams";

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
  setData,
  getData,
  structureTable,
  handleRowClick,
  handleDeleteRows,
  onCreateClick,
  columns,
  count = 0,
}: {
  tableName: string;
  count: number;
  data: any[] | undefined;
  handleDeleteRows: (
    setResults: React.Dispatch<React.SetStateAction<any>>,
    ids: number[],
    params: TableParams
  ) => Promise<void>;
  getData: any;
  handleRowClick: (data: any, params: TableParams) => void;
  onCreateClick?: (data: any, params: TableParams) => void;
  setData: React.Dispatch<React.SetStateAction<any>>;
  structureTable: (data: any[]) => any[] | undefined;
  columns: HeadCell[];
}) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("id");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    getData(
      setData,
      {
        search,
        limit: rowsPerPage || 5,
        offset: page * rowsPerPage,
        sort: {
          field:
            columns.find((column) => orderBy === column.id)?.sqlColumn ||
            orderBy,
          direction: order,
        },
      },
      setLoading
    );
  }, [search, rowsPerPage, page, order, orderBy]);

  const tableData = useMemo(
    () => (structureTable ? structureTable(data || []) : data) as any[],
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
    if (event.target.checked && data) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  return (
    <BlankCard>
      <Box mb={2} sx={{ mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          data={data}
          tableName={tableName}
          onCreateClick={onCreateClick}
          params={{
            search,
            limit: rowsPerPage || 5,
            offset: page * rowsPerPage,
            sort: {
              field:
                columns.find((column) => orderBy === column.id)?.sqlColumn ||
                orderBy,
              direction: order,
            },
          }}
          handleDeleteRows={handleDeleteRows}
          setData={setData}
          selected={selected}
          setSelected={setSelected}
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
              rowCount={data?.length || 0}
              columns={columns}
            />

            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "15px",
                    }}
                  >
                    <CircularProgress />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <EnhancedTableBody
                columns={columns}
                tableData={tableData}
                handleRowClick={handleRowClick}
                params={{
                  search,
                  limit: rowsPerPage || 5,
                  offset: page * rowsPerPage,
                  sort: {
                    field:
                      columns.find((column) => orderBy === column.id)
                        ?.sqlColumn || orderBy,
                    direction: order,
                  },
                }}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={count}
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
