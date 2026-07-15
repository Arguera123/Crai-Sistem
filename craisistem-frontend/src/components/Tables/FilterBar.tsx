import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import type { FilterConfigItem, TFilterConfig } from "../../types/filters";

interface FilterBarProps<T> {
  filters: Partial<T>;
  config: TFilterConfig<T>;
  onFilterChange: (newFilters: Partial<T>) => void;
}

export const FilterBar = <T extends object>({
  filters,
  config,
  onFilterChange,
}: FilterBarProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const activeKeys = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof T] !== undefined && config[key as keyof T] !== undefined
  ) as (keyof T)[];

  const availableFilters = (Object.entries(config) as [keyof T, FilterConfigItem][]).filter(
    ([key]) => !activeKeys.includes(key)
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddFilter = (key: keyof T) => {
    onFilterChange({ ...filters, [key]: "" as any });
    handleCloseMenu();
  };

  const handleRemoveFilter = (key: keyof T) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const handleUpdateValue = (key: keyof T, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1.5,
        borderRadius: 3,
        mb: 2,
        bgcolor: "background.paper",
      }}
    >
      {activeKeys.map((key) => {
        const itemConfig = config[key];
        if (!itemConfig) return null;

        return (
          <Box
            key={String(key)}
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              pl: 1.5,
              pr: 0.5,
              py: 0.5,
              gap: 1,
            }}
          >
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              {itemConfig.label}:
            </Typography>

            {/* Caso 1: Selector Booleano */}
            {itemConfig.type === "boolean" ? (
              <Select
                size="small"
                variant="standard"
                disableUnderline
                value={String(filters[key] ?? "")}
                onChange={(e) => handleUpdateValue(key, e.target.value === "true")}
                sx={{ fontSize: "0.875rem", fontWeight: 600, color: "primary.main" }}
              >
                <MenuItem value="">-</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            ) : 
            
            /* Caso 2: Selector con Opciones (Select) */
            itemConfig.type === "select" ? (
              <Select
                size="small"
                variant="standard"
                disableUnderline
                value={(filters[key] as any) || ""}
                onChange={(e) => handleUpdateValue(key, e.target.value)}
                sx={{ fontSize: "0.875rem", fontWeight: 600, color: "primary.main", minWidth: 60 }}
              >
                {itemConfig.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              
              /* Caso 3: Inputs de Texto / Fecha / Número */
              <TextField
                variant="standard"
                size="small"
                autoFocus
                type={itemConfig.type}
                value={(filters[key] as any) || ""}
                onChange={(e) => handleUpdateValue(key, e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: { 
                    fontSize: "0.875rem", 
                    fontWeight: 600, 
                    color: "primary.main", 
                    minWidth: itemConfig.type === "date" ? 120 : 80 
                  },
                }}
              />
            )}

            <IconButton size="small" onClick={() => handleRemoveFilter(key)}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        );
      })}

      <Button
        startIcon={<AddIcon />}
        onClick={handleOpenMenu}
        variant="outlined"
        size="small"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          borderStyle: "dashed",
          color: "text.secondary",
          borderColor: "divider",
          px: 2,
          "&:hover": { 
            borderStyle: "dashed",
            bgcolor: "action.hover" 
          },
        }}
      >
        Filtros
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { minWidth: 180, borderRadius: 2, mt: 1, boxShadow: 3 },
        }}
      >
        {availableFilters.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="caption">No hay más filtros</Typography>
          </MenuItem>
        ) : (
          availableFilters.map(([key, item]) => (
            <MenuItem key={String(key)} onClick={() => handleAddFilter(key)}>
              <Typography variant="body2">{item.label}</Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </Paper>
  );
};