import React, { useState } from 'react';
import { Paper, Typography, Box, Button, Divider, Alert, Snackbar } from '@mui/material';
import { CheckCircle, Cancel, Edit } from '@mui/icons-material';
import { RejectionModal } from './RejectionModal';
import type { RejectionReason } from '../../types';

interface ModerationActionsProps {
  advertisementId: string;
  onApprove: () => void;
  onReject: (reason: RejectionReason, comment?: string) => void;
  onRevision: () => void;
}

export const ModerationActions: React.FC<ModerationActionsProps> = ({
  onApprove,
  onReject,
  onRevision,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleApprove = () => {
    onApprove();
    setSnackbarMessage('Объявление одобрено');
    setSnackbarOpen(true);
  };

  const handleReject = (reason: RejectionReason, comment?: string) => {
    onReject(reason, comment);
    setSnackbarMessage('Объявление отклонено');
    setSnackbarOpen(true);
  };

  const handleRevision = () => {
    onRevision();
    setSnackbarMessage('Объявление отправлено на доработку');
    setSnackbarOpen(true);
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Действия модератора
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CheckCircle />}
            onClick={handleApprove}
            fullWidth
          >
            Одобрить
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<Cancel />}
            onClick={() => setRejectModalOpen(true)}
            fullWidth
          >
            Отклонить
          </Button>

          <Button
            variant="contained"
            color="warning"
            size="large"
            startIcon={<Edit />}
            onClick={handleRevision}
            fullWidth
          >
            На доработку
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="caption">
            <strong>Горячие клавиши:</strong>
            <br />А - Одобрить | D - Отклонить | ← Назад | → Вперед
          </Typography>
        </Alert>
      </Paper>

      <RejectionModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleReject}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};
