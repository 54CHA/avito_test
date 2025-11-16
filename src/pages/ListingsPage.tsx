import React, { useState, useEffect } from 'react';
import { Box, Grid, Pagination, Typography, Paper } from '@mui/material';
import { AdvertisementCard } from '../components/listings/AdvertisementCard';
import { FiltersPanel } from '../components/listings/FiltersPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import type { Advertisement, ListingFilters, PaginationParams } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { generateMockAdvertisements } from '../utils/mockData';

const ITEMS_PER_PAGE = 10;

export const ListingsPage: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ListingFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  // Load mock data (replace with API call in production)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData = generateMockAdvertisements(100);
        setAdvertisements(mockData);
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...advertisements];

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter((ad) =>
        ad.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((ad) => filters.status!.includes(ad.status));
    }

    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter((ad) => filters.category!.includes(ad.category));
    }

    // Apply price filters
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter((ad) => ad.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter((ad) => ad.price <= filters.priceMax!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (filters.sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (filters.sortBy === 'priority') {
        comparison = a.priority === 'urgent' ? -1 : 1;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredAds(filtered);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  }, [advertisements, debouncedSearch, filters]);

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPagination({ ...pagination, page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner message="Загрузка объявлений..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);
  const startIndex = (pagination.page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageAds = filteredAds.slice(startIndex, endIndex);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Объявления на модерации
      </Typography>

      <FiltersPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1">
          Найдено объявлений: <strong>{filteredAds.length}</strong>
        </Typography>
      </Paper>

      {currentPageAds.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Объявления не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Попробуйте изменить параметры фильтрации
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {currentPageAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={ad.id}>
                <AdvertisementCard advertisement={ad} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
