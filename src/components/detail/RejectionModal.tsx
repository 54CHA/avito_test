import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import type { RejectionReason } from '../../types';
import { getRejectionReasonLabel } from '../../utils/formatters';

interface RejectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: RejectionReason, comment?: string) => void;
}

const rejectionReasons: RejectionReason[] = [
  'prohibited-item',
  'wrong-category',
  'incorrect-description',
  'photo-issues',
  'suspected-fraud',
  'other',
];

export const RejectionModal: React.FC<RejectionModalProps> = ({ open, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<RejectionReason>('prohibited-item');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedReason, comment || undefined);
    setComment('');
    onClose();
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Отклонить объявление</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
          <FormLabel component="legend">Причина отклонения *</FormLabel>
          <RadioGroup
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value as RejectionReason)}
          >
            {rejectionReasons.map((reason) => (
              <FormControlLabel
                key={reason}
                value={reason}
                control={<Radio />}
                label={getRejectionReasonLabel(reason)}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Комментарий (опционально)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Добавьте пояснение к причине отклонения..."
          sx={{ mt: 3 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="error">
          Отклонить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
