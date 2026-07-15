import { createColumnHelper } from "@tanstack/react-table";
import { IconButton, Chip, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { TWifiUserResponse } from "../../../types/wifiUser";

const columnHelper = createColumnHelper<TWifiUserResponse>();

export const assignmentColumns = (onAssign: (wifiUser: TWifiUserResponse) => void) => [
  columnHelper.display({
    id: 'expander',
    header: () => null,
    size: 50,
    cell: ({ row }) => (
      <IconButton size="small" onClick={() => row.toggleExpanded()}>
        {row.getIsExpanded() ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    ),
  }),

  columnHelper.accessor("id", { header: "ID", size: 100 }),

  columnHelper.accessor((row) => row.assignments.length, {
    id: "count",
    header: "Cupos",
    size: 100,
    cell: (info) => {
      const count = info.getValue();
      const isFull = count >= 3;
      return (
        <Chip 
          label={`${count}/3`} 
          size="small" 
          color={isFull ? "error" : count > 0 ? "warning" : "success"}
          variant="outlined"
        />
      );
    }
  }),

  columnHelper.accessor("password", {
    header: "Password",
    size: 130,
    cell: (info) => <code style={{ fontFamily: 'monospace' }}>{info.getValue()}</code>,
  }),

  columnHelper.display({
    id: "actions",
    header: "Asignar",
    size: 80,
    cell: ({ row }) => (
      <Tooltip title="Asignar nuevo usuario">
        <span>
          <IconButton 
            color="primary" 
            size="small"
            onClick={() => onAssign(row.original)}
            disabled={row.original.assignments.length >= 3}
          >
            <PersonAddIcon />
          </IconButton>
        </span>
      </Tooltip>
    )
  }),

  columnHelper.accessor("creationDate", { header: "Fecha Creación", size: 130 }),
  columnHelper.accessor("expirationDate", { header: "Fecha Expiración", size: 130 }),
];