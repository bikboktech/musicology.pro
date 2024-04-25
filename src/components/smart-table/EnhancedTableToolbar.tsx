import { alpha } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { IconTrash, IconFilter, IconPlus } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { TableParams } from "../../types/smartTable/TableParams";

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleDeleteRows: (
    setResults: React.Dispatch<React.SetStateAction<any>>,
    ids: number[],
    params: TableParams
  ) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  handleSearch: React.ChangeEvent<HTMLInputElement> | any;
  onCreateClick?: (data: any, params: TableParams) => void;
  data: any[] | undefined;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  search: string;
  tableName: string;
  params: TableParams;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    data,
    handleDeleteRows,
    setData,
    selected,
    setSelected,
    handleSearch,
    onCreateClick,
    search,
    tableName,
    params,
  } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle2"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder={`Search ${tableName}`}
            size="small"
            onChange={handleSearch}
            value={search}
          />
        </Box>
      )}
      {!numSelected && onCreateClick && (
        <Tooltip title={`Create ${tableName}`}>
          <IconButton onClick={() => onCreateClick(data, params)}>
            <IconPlus size={18} />
          </IconButton>
        </Tooltip>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => setOpen(true)}>
            <IconTrash width={18} />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
        // <Tooltip title="Filter list">
        //   <IconButton>
        //     <IconFilter width={18} />
        //   </IconButton>
        // </Tooltip>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
          },
        }}
      >
        <DialogContent>
          <Typography>
            Are you sure you want to delete {numSelected ?? 0}{" "}
            {numSelected === 1
              ? tableName.substring(0, tableName.length - 1).toLowerCase()
              : tableName.toLowerCase()}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={() => {
                setLoading(true);
                handleDeleteRows(setData, selected, params).then(() => {
                  setLoading(false);
                  setSelected([]);
                  setOpen(false);
                });
              }}
              autoFocus
            >
              Yes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Toolbar>
  );
}
