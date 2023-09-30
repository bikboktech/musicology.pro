import { alpha } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { IconTrash, IconFilter } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleDeleteRows: (
    setResults: React.Dispatch<React.SetStateAction<any>>,
    ids: number[]
  ) => void;
  setData: React.Dispatch<React.SetStateAction<any>>;
  handleSearch: React.ChangeEvent<HTMLInputElement> | any;
  selected: number[];
  search: string;
  tableName: string;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    handleDeleteRows,
    setData,
    selected,
    handleSearch,
    search,
    tableName,
  } = props;

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
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteRows(setData, selected)}>
            <IconTrash width={18} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <IconFilter width={18} />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
