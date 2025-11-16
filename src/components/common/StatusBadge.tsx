import React from 'react';
import { Chip } from '@mui/material';
import type { AdvertisementStatus } from '../../types';
import { getStatusLabel } from '../../utils/formatters';

interface StatusBadgeProps {
  status: AdvertisementStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const getStatusColor = (): 'default' | 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'revision':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip label={getStatusLabel(status)} color={getStatusColor()} size={size} />
  );
};
