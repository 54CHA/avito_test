import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = 'Произошла ошибка при загрузке данных',
  onRetry,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={2}
    >
      <Alert severity="error" icon={<ErrorIcon fontSize="large" />} sx={{ maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
          Ошибка
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Alert>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </Box>
  );
};
