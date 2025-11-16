import React, { useState, useEffect } from 'react';
import { Box, Grid, Pagination, Typography, Paper } from '@mui/material';
import { AdvertisementCard } from '../components/listings/AdvertisementCard';
import { FiltersPanel } from '../components/listings/FiltersPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import type { Advertisement, ListingFilters, PaginationParams } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { getAdvertisements } from '../services/api';

const ITEMS_PER_PAGE = 10;

export const ListingsPage: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [totalAds, setTotalAds] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
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

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdvertisements(
          {
            ...filters,
            search: debouncedSearch,
          },
          pagination
        );

        setAdvertisements(response.data);
        setTotalAds(response.total);
        setTotalPages(response.totalPages);
        setInitialLoad(false);
      } catch (err: any) {
        // Ignore canceled requests (they're superseded by new requests)
        if (err?.code === 'ERR_CANCELED') {
          return;
        }
        console.error('API Error:', err);
        setError('Не удалось загрузить данные');
        setInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, debouncedSearch, pagination]);


  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: 'date',
      sortOrder: 'desc',
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPagination({ ...pagination, page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  if (initialLoad && loading) {
    return <LoadingSpinner message="Загрузка объявлений..." />;
  }

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
          Найдено объявлений: <strong>{totalAds}</strong>
        </Typography>
      </Paper>

      {loading ? (
        <LoadingSpinner message="Загрузка..." />
      ) : advertisements.length === 0 ? (
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
            {advertisements.map((ad) => (
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
