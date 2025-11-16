import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Stack,
} from '@mui/material';
import { ArrowBack, ArrowForward, ArrowBackIos } from '@mui/icons-material';
import { ImageGallery } from '../components/detail/ImageGallery';
import { SellerInfo } from '../components/detail/SellerInfo';
import { ModerationHistory } from '../components/detail/ModerationHistory';
import { ModerationActions } from '../components/detail/ModerationActions';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import type { Advertisement, RejectionReason } from '../types';
import { formatPrice, formatDate, getCategoryLabel } from '../utils/formatters';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { getAdvertisementById, submitModerationDecision } from '../services/api';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdvertisement = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('ID не указан');
        }

        const adData = await getAdvertisementById(id);
        setAdvertisement(adData);
        setInitialLoad(false);
      } catch (err: any) {
        // Ignore canceled requests
        if (err?.code === 'ERR_CANCELED') {
          return;
        }
        console.error('API Error:', err);
        setError('Не удалось загрузить объявление');
        setInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    loadAdvertisement();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;

    try {
      await submitModerationDecision(id, { action: 'approve' });
      // Reload advertisement to see updated status
      const adData = await getAdvertisementById(id);
      setAdvertisement(adData);
      console.log('Approved:', id);
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Не удалось одобрить объявление');
    }
  };

  const handleReject = async (reason: RejectionReason, comment?: string) => {
    if (!id) return;

    try {
      await submitModerationDecision(id, {
        action: 'reject',
        reason,
        comment
      });
      // Reload advertisement to see updated status
      const adData = await getAdvertisementById(id);
      setAdvertisement(adData);
      console.log('Rejected:', id, reason, comment);
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Не удалось отклонить объявление');
    }
  };

  const handleRevision = async (comment: string) => {
    if (!id) return;

    try {
      await submitModerationDecision(id, {
        action: 'revision',
        reason: 'Требуются изменения' as any, // Backend expects reason field
        comment: comment
      });
      // Reload advertisement to see updated status
      const adData = await getAdvertisementById(id);
      setAdvertisement(adData);
      console.log('Revision:', id, comment);
    } catch (err) {
      console.error('Failed to request revision:', err);
      alert('Не удалось запросить доработку');
    }
  };

  const handleBack = () => {
    navigate('/list');
  };

  const handlePrevious = () => {
    if (id) {
      const prevId = Math.max(1, parseInt(id) - 1);
      navigate(`/item/${prevId}`);
    }
  };

  const handleNext = () => {
    if (id) {
      const nextId = parseInt(id) + 1;
      navigate(`/item/${nextId}`);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      a: handleApprove,
      d: () => console.log('Reject shortcut - modal should open'),
      arrowleft: handlePrevious,
      arrowright: handleNext,
    },
    !!advertisement
  );

  if (error) {
    return <ErrorDisplay message={error} onRetry={handleBack} />;
  }

  if (!advertisement) {
    return <LoadingSpinner message="Загрузка объявления..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIos />} onClick={handleBack} variant="outlined">
          К списку
        </Button>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<ArrowBack />} onClick={handlePrevious} variant="outlined">
            Предыдущее
          </Button>
          <Button endIcon={<ArrowForward />} onClick={handleNext} variant="outlined">
            Следующее
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left column */}
        <Grid item xs={12} md={8}>
          <Box mb={3}>
            <Stack direction="row" spacing={1} mb={2}>
              <StatusBadge status={advertisement.status} size="medium" />
              <PriorityBadge priority={advertisement.priority} size="medium" />
            </Stack>
            <Typography variant="h4" component="h1" gutterBottom>
              {advertisement.title}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {formatPrice(advertisement.price)}
            </Typography>
          </Box>

          <Box mb={3}>
            <ImageGallery images={advertisement.images} alt={advertisement.title} />
          </Box>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {advertisement.description}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Характеристики
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Категория</TableCell>
                  <TableCell>{getCategoryLabel(advertisement.category)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Дата создания</TableCell>
                  <TableCell>{formatDate(advertisement.createdAt)}</TableCell>
                </TableRow>
                {Object.entries(advertisement.characteristics).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <ModerationHistory history={advertisement.moderationHistory || []} />
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={4}>
          <Box position="sticky" top={20}>
            <Box mb={3}>
              <ModerationActions
                advertisementId={advertisement.id}
                onApprove={handleApprove}
                onReject={handleReject}
                onRevision={handleRevision}
              />
            </Box>
            <SellerInfo seller={advertisement.seller} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
