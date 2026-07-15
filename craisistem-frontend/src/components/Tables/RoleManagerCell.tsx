import { useState } from "react";
import { Box, Chip, IconButton, Menu, MenuItem, Checkbox, ListItemText, Tooltip, CircularProgress } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUserRoles } from "../../hooks/useRole";

interface RoleManagerProps {
  userId: string | number;
  currentRoles: string[];
  allRoles: string[];
}

export const RoleManagerCell = ({ userId, currentRoles, allRoles }: RoleManagerProps) => {
  const { assignRole, removeRole, isLoading } = useUserRoles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // --- Manejadores del Menú ---
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleRole = (roleName: string) => {
    const isAssigned = currentRoles.includes(roleName);

    if (isAssigned) {
      removeRole({ userId: String(userId), role: roleName });
    } else {
      assignRole({ userId: String(userId), role: roleName });
    }
    // No cerramos el menú automáticamente para permitir cambios múltiples, 
    // a menos que prefieras que se cierre al hacer click.
  };

  return (
    <Box 
      display="flex" 
      gap={0.5} 
      flexWrap="wrap" 
      alignItems="center"
      sx={{ minHeight: 40 }} 
    >
      {currentRoles.map((role) => (
        <Chip
          key={role}
          label={role}
          size="small"
          color="primary"
          variant="filled"
          onDelete={() => handleToggleRole(role)}
          disabled={isLoading}
          sx={{ fontSize: "0.75rem", fontWeight: 500 }}
        />
      ))}
      {isLoading ? (
        <CircularProgress size={20} sx={{ ml: 1 }} />
      ) : (
        <Tooltip title="Gestionar roles">
          <IconButton 
            size="small" 
            onClick={handleOpen} 
            color="primary"
            disabled={isLoading}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { maxHeight: 300, width: '20ch' }
          }
        }}
      >
        {allRoles.map((role) => {
          const isChecked = currentRoles.includes(role);
          return (
            <MenuItem key={role} onClick={() => handleToggleRole(role)}>
              <Checkbox 
                checked={isChecked} 
                size="small" 
                sx={{ p: 0.5 }}
              />
              <ListItemText 
                primary={role} 
                primaryTypographyProps={{ variant: 'body2' }} 
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};