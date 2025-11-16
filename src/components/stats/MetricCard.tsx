import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary.main',
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ color }}>{icon}</Box>
      </Box>

      <Typography variant="h3" fontWeight="bold" sx={{ color }}>
        {value}
      </Typography>

      {trend && (
        <Box display="flex" alignItems="center" mt={1}>
          {trend === 'up' ? (
            <TrendingUp color="success" fontSize="small" />
          ) : (
            <TrendingDown color="error" fontSize="small" />
          )}
        </Box>
      )}
    </Paper>
  );
};
