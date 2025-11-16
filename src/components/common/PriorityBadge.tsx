import React from 'react';
import { Chip } from '@mui/material';
import { PriorityHigh } from '@mui/icons-material';
import type { Priority } from '../../types';
import { getPriorityLabel } from '../../utils/formatters';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'small' }) => {
  if (priority === 'normal') {
    return null;
  }

  return (
    <Chip
      label={getPriorityLabel(priority)}
      color="error"
      size={size}
      icon={<PriorityHigh />}
    />
  );
};
