import { 
  Box, 
  Typography, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell
} from "@mui/material";

export const renderAssignmentsDetail = ({ row }: { row: any }) => {
  const { assignments } = row.original;

  if (!assignments || assignments.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No hay asignaciones registradas para esta cuenta.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 1 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
        Historial de Asignaciones
      </Typography>
      <Table size="small" aria-label="assignments">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID Usuario</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nombre Completo</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Bibliotecario (Entrega)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Fecha y Hora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((asig: any, index: number) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {asig.user.id}
              </TableCell>
              <TableCell>
                {`${asig.user.firstName} ${asig.user.lastName}`}
              </TableCell>
              <TableCell>
                {`${asig.librarian.firstName} ${asig.librarian.lastName}`}
              </TableCell>
              <TableCell>
                {new Date(asig.timestamp).toLocaleString('es-ES', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};