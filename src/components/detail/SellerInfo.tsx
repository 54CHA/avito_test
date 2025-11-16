import React from 'react';
import { Paper, Typography, Box, Rating, Divider } from '@mui/material';
import { Person, CalendarToday, Inventory } from '@mui/icons-material';
import type { Seller } from '../../types';
import { formatDate } from '../../utils/formatters';

interface SellerInfoProps {
  seller: Seller;
}

export const SellerInfo: React.FC<SellerInfoProps> = ({ seller }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Информация о продавце
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Person color="action" />
        <Typography variant="body1">
          <strong>{seller.name}</strong>
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="body2">Рейтинг:</Typography>
        <Rating value={seller.rating} precision={0.1} readOnly size="small" />
        <Typography variant="body2" color="text.secondary">
          ({seller.rating})
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Inventory fontSize="small" color="action" />
        <Typography variant="body2">
          Объявлений: <strong>{seller.listingsCount}</strong>
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <CalendarToday fontSize="small" color="action" />
        <Typography variant="body2">
          На сайте с: <strong>{formatDate(seller.registrationDate)}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};
