import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Avatar, Box, Typography } from "@mui/material";
import type {
  TDeviceLoanResponse,
  TLoanResponse,
  TLockerLoanResponse,
} from "../../../types/loan";

const createBaseLoanColumns = <T extends TLoanResponse>(): ColumnDef<
  T,
  any
>[] => {
  const baseHelper = createColumnHelper<T>();

  return [
    baseHelper.accessor((row) => row.user.id, {
      id: "userId",
      header: "Carnet",
      size: 80,
    }) as ColumnDef<T, any>,

    baseHelper.accessor(
      (row) =>
        `${row.user.lastName.toUpperCase()} ${row.user.firstName.toUpperCase()}`,
      {
        id: "userName",
        header: "Nombre",
        size: 220,
        cell: (info) => {
          const row = info.row.original;
          return (
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar src={row.user.photo} sx={{ width: 32, height: 32 }}>
                {!row.user.photo && row.user.firstName?.[0]}
              </Avatar>
              <Typography variant="body2">{info.getValue()}</Typography>
            </Box>
          );
        },
      },
    ) as ColumnDef<T, any>,

    baseHelper.accessor((row) => row.date, {
      id: "date",
      header: "Fecha",
      size: 110,
      cell: (info) => {
        const value = info.getValue() as string;
        if (!value) return "";
        return new Date(value).toLocaleDateString("es-ES", { timeZone: "UTC" });
      },
    }) as ColumnDef<T, any>,

    baseHelper.accessor(
      (row) =>
        row.charge
          ? `${row.charge.librarian.firstName} ${row.charge.librarian.lastName}`
          : "—",
      {
        id: "chargeLibrarian",
        header: "Cargo",
        size: 160,
      },
    ) as ColumnDef<T, any>,

    baseHelper.accessor((row) => row.charge?.startTime, {
      id: "chargeStartTime",
      header: "Hora",
      size: 70,
      minSize: 60,
      maxSize: 80,
      cell: (info) => {
        const value = info.getValue();
        return (
          <Box width="100%" textAlign="right" whiteSpace="nowrap">
            {value ? value.slice(0, 5) : "—"}
          </Box>
        );
      },
    }) as ColumnDef<T, any>,

    baseHelper.accessor(
      (row) =>
        row.release
          ? `${row.release.librarian.firstName} ${row.release.librarian.lastName}`
          : "—",
      {
        id: "releaseLibrarian",
        header: "Descargo",
        size: 160,
      },
    ) as ColumnDef<T, any>,

    baseHelper.accessor((row) => row.release?.endTime, {
      id: "releaseEndTime",
      header: "Hora",
      size: 70,
      minSize: 60,
      maxSize: 80,
      cell: (info) => {
        const value = info.getValue();
        return (
          <Box width="100%" textAlign="right" whiteSpace="nowrap">
            {value ? value.slice(0, 5) : "—"}
          </Box>
        );
      },
    }) as ColumnDef<T, any>,
  ];
};

const deviceHelper = createColumnHelper<TDeviceLoanResponse>();

export const deviceLoanColumns: ColumnDef<TDeviceLoanResponse, any>[] = [
  ...createBaseLoanColumns<TDeviceLoanResponse>(),
  deviceHelper.accessor("device.id", {
    header: "Device",
    size: 100,
  }),
];

const lockerHelper = createColumnHelper<TLockerLoanResponse>();

export const lockerLoanColumns: ColumnDef<TLockerLoanResponse, any>[] = [
  ...createBaseLoanColumns<TLockerLoanResponse>(),
  lockerHelper.accessor("locker.id", {
    header: "Locker",
    size: 100,
  }),
];
