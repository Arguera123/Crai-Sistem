import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel, // Importante
  type Table as TanstackTable,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type ExpandedState,
} from "@tanstack/react-table";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Box,
} from "@mui/material";
import React, { useState, type ReactNode } from "react";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  pageCount: number;
  renderSubComponent: (props: { row: any }) => ReactNode; // Nueva prop
  children?: (table: TanstackTable<TData>) => ReactNode;
}

export function DataTableCollapse<TData>({
  data,
  columns,
  pagination,
  onPaginationChange,
  pageCount,
  renderSubComponent,
  children,
}: DataTableProps<TData>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: { pagination, expanded },
    onPaginationChange,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    pageCount,
    autoResetPageIndex: false,
    getRowCanExpand: () => true,
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableCell key={header.id} sx={{ fontWeight: 600 }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow hover selected={row.getIsExpanded()}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Fila Colapsable */}
                <TableRow>
                  <TableCell sx={{ py: 0 }} colSpan={columns.length}>
                    <Collapse in={row.getIsExpanded()} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        {renderSubComponent({ row })}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {children && children(table)}
    </Paper>
  );
}