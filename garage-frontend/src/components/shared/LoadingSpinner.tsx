import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="40vh"
      gap={2}
    >
      <CircularProgress
        sx={{
          color: '#6C63FF',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
        size={44}
        thickness={4}
      />
      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
