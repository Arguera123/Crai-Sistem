import { Box, Paper, Typography } from '@mui/material'
import type { ILocker } from '../types/loker'

type Props = {
  lockers: any[]
  onSelectLocker: (locker: ILocker) => void
}

export default function LockersGrid({ lockers, onSelectLocker }: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(7, 60px)', 
        gridAutoColumns: '60px', 
        gap: 1.5,overflowX: 'auto',
        pb: 1 
      }}
    >
      {lockers.map((locker) => {
        const isOccupied = locker.state === "occupied";
        
        return (
          <Paper
            key={locker.id}
            elevation={isOccupied ? 0 : 2}
            onClick={() => onSelectLocker(locker)}
            sx={{
              height: 60,
              width: 60, // Mantenemos el tamaño cuadrado
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              bgcolor: isOccupied ? 'error.light' : 'success.light',
              color: isOccupied ? 'error.contrastText' : 'success.contrastText',
              border: '2px solid',
              borderColor: isOccupied ? 'error.main' : 'success.main',
              '&:hover': {
                transform: 'scale(1.05)',
                bgcolor: isOccupied ? 'error.main' : 'success.main',
              },
            }}
          >
            <Typography fontWeight={800}>
              {locker.id}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  )
}