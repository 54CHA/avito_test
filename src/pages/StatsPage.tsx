import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  Assignment,
  CheckCircle,
  Cancel,
  AccessTime,
} from '@mui/icons-material';
import { MetricCard } from '../components/stats/MetricCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import type { Statistics } from '../types';
import { generateMockStatistics } from '../utils/mockData';
import { getCategoryLabel } from '../utils/formatters';

export const StatsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>('week');

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockStats = generateMockStatistics();
        setStatistics(mockStats);
      } catch (err) {
        setError('Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [dateRange]);

  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
  };

  if (loading) {
    return <LoadingSpinner message="Загрузка статистики..." />;
  }

  if (error || !statistics) {
    return (
      <ErrorDisplay
        message={error || 'Не удалось загрузить статистику'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const totalReviewed =
    dateRange === 'today'
      ? statistics.totalReviewed.today
      : dateRange === 'week'
        ? statistics.totalReviewed.week
        : statistics.totalReviewed.month;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Статистика модерации
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Период</InputLabel>
          <Select value={dateRange} onChange={handleDateRangeChange} label="Период">
            <MenuItem value="today">Сегодня</MenuItem>
            <MenuItem value="week">За неделю</MenuItem>
            <MenuItem value="month">За месяц</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Проверено объявлений"
            value={totalReviewed}
            icon={<Assignment fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Процент одобрения"
            value={`${statistics.approvalPercentage}%`}
            icon={<CheckCircle fontSize="large" />}
            color="success.main"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Процент отклонения"
            value={`${statistics.rejectionPercentage}%`}
            icon={<Cancel fontSize="large" />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Среднее время проверки"
            value={`${statistics.averageReviewTime} мин`}
            icon={<AccessTime fontSize="large" />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Активность по дням (последние 7 дней)
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: statistics.activityByDay.map((day) => {
                      const date = new Date(day.date);
                      return date.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                      });
                    }),
                  },
                ]}
                series={[
                  {
                    data: statistics.activityByDay.map((day) => day.count),
                    label: 'Проверено объявлений',
                    color: '#1976d2',
                  },
                ]}
                height={350}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Распределение решений
            </Typography>
            <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center' }}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: statistics.decisionDistribution.approved,
                        label: 'Одобрено',
                        color: '#4caf50',
                      },
                      {
                        id: 1,
                        value: statistics.decisionDistribution.rejected,
                        label: 'Отклонено',
                        color: '#f44336',
                      },
                      {
                        id: 2,
                        value: statistics.decisionDistribution.revision,
                        label: 'На доработку',
                        color: '#ff9800',
                      },
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={350}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Проверено по категориям
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: statistics.reviewedByCategory.map((cat) =>
                      getCategoryLabel(cat.category)
                    ),
                  },
                ]}
                series={[
                  {
                    data: statistics.reviewedByCategory.map((cat) => cat.count),
                    label: 'Количество проверок',
                    color: '#9c27b0',
                  },
                ]}
                height={350}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
