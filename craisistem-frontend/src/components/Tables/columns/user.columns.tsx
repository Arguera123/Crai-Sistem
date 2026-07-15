import { Avatar, Box, Chip, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { RoleManagerCell } from "../RoleManagerCell";
import { USER_PREFIXES } from "../../UserFormModal";
import type { UserType } from "../../../utils/user-type.constants";
import type { TUserResponse } from "../../../types/user";
import { Roles } from "../../../utils/user-states.constants";

const userHelper = createColumnHelper<TUserResponse>();
const AVAILABLE_ROLES = ["admin", "user", "librarian", "learningcenter", "reception"];

export const getUserColumns = (currentUserRoles: string[] = []) => {
  const isAdmin = currentUserRoles.includes(Roles.ADMIN);

  const columns = [
    userHelper.accessor("id", {
      header: "Carnet",
      size: 90,
    }),

    userHelper.accessor((row) => `${row.lastName.toUpperCase()} ${row.firstName.toUpperCase()}`, {
      id: "fullName", 
      header: "Nombre Completo",
      size: 250,
      cell: (info) => {
        const row = info.row.original;
        return (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar src={row.photo} sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
              {!row.photo && row.firstName?.[0]}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {info.getValue()}
            </Typography>
          </Box>
        );
      },
    }),

    userHelper.accessor("email", {
      header: "Correo Electrónico",
      size: 220,
      cell: (info) => (
        <Typography variant="body2" color="text.secondary">
          {info.getValue()}
        </Typography>
      ),
    }),

    userHelper.accessor("faculty", {
      header: "Facultad",
      size: 220,
      cell: (info) => (
        <Typography variant="body2" color="text.secondary">
          {info.getValue()}
        </Typography>
      ),
    }),

    userHelper.accessor("type", {
      header: "Tipo",
      size: 150, 
      cell: (info) => {
        const value = info.getValue() as UserType;
        const prefixMatch = USER_PREFIXES.find((p) => p.value === value);
        const label = prefixMatch ? prefixMatch.label.split(' - ')[1] : value;
        return (
          <Chip
            label={label}
            size="small"
            variant="outlined"
            color={prefixMatch ? "primary" : "default"} 
            sx={{ textTransform: prefixMatch ? "none" : "capitalize", fontWeight: 500 }}
          />
        );
      },
    }),

    ...(isAdmin ? [
      userHelper.accessor("roles", {
        header: "Roles",
        size: 220,
        cell: (info) => (
          <RoleManagerCell
            userId={info.row.original.id}
            currentRoles={info.getValue()}
            allRoles={AVAILABLE_ROLES}
          />
        ),
      })
    ] : []),

    userHelper.accessor("state", {
      header: "Estado",
      size: 100,
      cell: (info) => {
        const state = info.getValue();
        const isActive = state === "active";
        return (
          <Chip
            label={isActive ? "Activo" : "Inactivo"}
            size="small"
            color={isActive ? "success" : "error"}
          />
        );
      },
    }),

    userHelper.accessor("expirationDate", {
      header: "Vencimiento",
      size: 120,
      cell: (info) => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString() : "—";
      },
    }),
  ];

  return columns;
};