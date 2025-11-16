import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { CheckCircle, Cancel, Edit, PendingActions } from '@mui/icons-material';
import type { ModerationAction } from '../../types';
import { formatDateTime, getStatusLabel } from '../../utils/formatters';

interface ModerationHistoryProps {
  history: ModerationAction[];
}

export const ModerationHistory: React.FC<ModerationHistoryProps> = ({ history }) => {
  const getActionIcon = (action: ModerationAction['action']) => {
    switch (action) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      case 'revision':
        return <Edit />;
      default:
        return <PendingActions />;
    }
  };

  const getActionColor = (
    action: ModerationAction['action']
  ): 'success' | 'error' | 'warning' | 'grey' => {
    switch (action) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'revision':
        return 'warning';
      default:
        return 'grey';
    }
  };

  if (history.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          История модерации
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          История действий пока пуста
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        История модерации
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Timeline position="right">
        {history.map((action, index) => (
          <TimelineItem key={action.id}>
            <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
              <Typography variant="caption">{formatDateTime(action.timestamp)}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={getActionColor(action.action)}>
                {getActionIcon(action.action)}
              </TimelineDot>
              {index < history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2" fontWeight="bold">
                {getStatusLabel(action.action)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Модератор: {action.moderatorName}
              </Typography>
              {action.comment && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {action.comment}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};
