import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface RevisionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Запрос на доработку</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Комментарий для продавца"
            placeholder="Укажите, что необходимо изменить в объявлении..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            helperText="Опишите, какие изменения требуются"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="warning"
          disabled={!comment.trim()}
        >
          Отправить на доработку
        </Button>
      </DialogActions>
    </Dialog>
  );
};
