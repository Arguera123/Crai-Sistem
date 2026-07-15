import { createColumnHelper } from "@tanstack/react-table";
import { Box, Typography, Avatar } from "@mui/material";
import type { TCheckinResponse } from "../../../types/checkin";

const baseHelper = createColumnHelper<TCheckinResponse>();

export const checkinColumns = [
  baseHelper.accessor("id", {
    header: "ID / Carnet",
    size: 90,
  }),

  baseHelper.accessor((row) => `${row.lastName.toUpperCase()} ${row.firstName.toUpperCase()}`, {
    id: "fullName",
    header: "Nombre",
    size: 220,
    cell: (info) => {
      const row = info.row.original;
      return (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'primary.light' }}>
            {row.firstName?.[0]}
          </Avatar>
          <Typography variant="body2">{info.getValue()}</Typography>
        </Box>
      );
    },
  }),

  baseHelper.accessor("date", {
    header: "Fecha",
    size: 110,
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),

  baseHelper.accessor("time", {
    header: "Hora",
    size: 70,
    minSize: 60,
    maxSize: 80,
    cell: (info) => {
      const value = info.getValue();
      return (
        <Box width="100%" textAlign="right" whiteSpace="nowrap" fontWeight={500}>
          {value ? value.slice(0, 5) : "—"}
        </Box>
      );
    },
  }),
];