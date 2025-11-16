import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Advertisement } from '../../types';
import { formatPrice, formatRelativeTime, getCategoryLabel } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

interface AdvertisementCardProps {
  advertisement: Advertisement;
}

export const AdvertisementCard: React.FC<AdvertisementCardProps> = ({ advertisement }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/item/${advertisement.id}`);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={advertisement.images[0]}
        alt={advertisement.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.6em',
          }}
        >
          {advertisement.title}
        </Typography>

        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
          {formatPrice(advertisement.price)}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
          <StatusBadge status={advertisement.status} />
          <PriorityBadge priority={advertisement.priority} />
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            {getCategoryLabel(advertisement.category)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(advertisement.createdAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
