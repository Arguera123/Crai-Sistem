import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import type { Table } from "@tanstack/react-table";
import type { TPagination } from "../../types/pagination";

interface IPaginationControlsProps<TData> {
  table: Table<TData>;
  meta: TPagination;
}

export const PaginationControls = <TData,>({
  table,
  meta,
}: IPaginationControlsProps<TData>) => {
  const { pageIndex, pageSize } = table.getState().pagination;

  const first = meta.total === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min((pageIndex + 1) * pageSize, meta.total);

  return (
    <Grid container alignItems="center" sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ width: "100%" }}>
        <Typography variant="body2">Filas por página:</Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
            table.setPageIndex(0);
          }}
        >
          {[10, 15, 20].map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>

        <Typography variant="body2" color="text.secondary">
          {first}–{last} de {meta.total}
        </Typography>

        <Stack direction="row">
          <IconButton
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <NavigateBefore />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <NavigateNext />
          </IconButton>
        </Stack>
      </Stack>
    </Grid>
  );
};
