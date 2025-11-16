import React from 'react';
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import type { ListingFilters, AdvertisementStatus, Category } from '../../types';
import { getStatusLabel, getCategoryLabel } from '../../utils/formatters';

interface FiltersPanelProps {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  onReset: () => void;
}

const statusOptions: AdvertisementStatus[] = ['pending', 'approved', 'rejected', 'revision'];
const categoryOptions: Category[] = [
  'electronics',
  'clothing',
  'furniture',
  'vehicles',
  'real-estate',
  'other',
];

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      status: (typeof value === 'string' ? value.split(',') : value) as AdvertisementStatus[],
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      category: (typeof value === 'string' ? value.split(',') : value) as Category[],
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: event.target.value });
  };

  const handlePriceMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? Number(event.target.value) : undefined;
    onFiltersChange({ ...filters, priceMin: value });
  };

  const handlePriceMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? Number(event.target.value) : undefined;
    onFiltersChange({ ...filters, priceMax: value });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    onFiltersChange({ ...filters, sortBy: event.target.value as ListingFilters['sortBy'] });
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    onFiltersChange({
      ...filters,
      sortOrder: event.target.value as ListingFilters['sortOrder'],
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6">Фильтры и поиск</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Поиск по названию"
            variant="outlined"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Введите название товара..."
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Цена от"
            type="number"
            variant="outlined"
            value={filters.priceMin || ''}
            onChange={handlePriceMinChange}
            placeholder="0"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Цена до"
            type="number"
            variant="outlined"
            value={filters.priceMax || ''}
            onChange={handlePriceMaxChange}
            placeholder="1000000"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              multiple
              value={filters.status || []}
              onChange={handleStatusChange}
              input={<OutlinedInput label="Статус" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getStatusLabel(value)} size="small" />
                  ))}
                </Box>
              )}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {getStatusLabel(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              multiple
              value={filters.category || []}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Категория" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getCategoryLabel(value)} size="small" />
                  ))}
                </Box>
              )}
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={filters.sortBy || 'date'}
              onChange={handleSortChange}
              label="Сортировка"
            >
              <MenuItem value="date">По дате</MenuItem>
              <MenuItem value="price">По цене</MenuItem>
              <MenuItem value="priority">По приоритету</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Порядок</InputLabel>
            <Select
              value={filters.sortOrder || 'desc'}
              onChange={handleSortOrderChange}
              label="Порядок"
            >
              <MenuItem value="asc">По возрастанию</MenuItem>
              <MenuItem value="desc">По убыванию</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={onReset}
            fullWidth
            sx={{ mt: 1 }}
          >
            Сбросить все фильтры
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
