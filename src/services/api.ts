import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  Advertisement,
  ApiResponse,
  ListingFilters,
  ModerationAction,
  ModerationDecisionRequest,
  PaginatedResponse,
  PaginationParams,
  Statistics,
  Category,
} from '../types';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens or other headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Ignore canceled requests (they're intentional)
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// AbortController map for request cancellation
const abortControllers = new Map<string, AbortController>();

/**
 * Cancel a pending request by key
 */
export const cancelRequest = (key: string): void => {
  const controller = abortControllers.get(key);
  if (controller) {
    controller.abort();
    abortControllers.delete(key);
  }
};

/**
 * Create a new AbortController for a request
 */
const getAbortController = (key: string): AbortController => {
  cancelRequest(key); // Cancel any existing request with the same key
  const controller = new AbortController();
  abortControllers.set(key, controller);
  return controller;
};

// API endpoints

/**
 * Get all advertisements with filters and pagination
 */
export const getAdvertisements = async (
  filters: ListingFilters = {},
  pagination: PaginationParams = { page: 1, limit: 10 }
): Promise<PaginatedResponse<Advertisement>> => {
  const controller = getAbortController('advertisements');

  const params = {
    page: pagination.page,
    limit: pagination.limit,
    ...filters,
    status: filters.status?.join(','),
    category: filters.category?.join(','),
  };

  const response = await api.get<{
    ads: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }>('/ads', {
    params,
    signal: controller.signal,
  });

  abortControllers.delete('advertisements');

  // Transform backend response to match frontend expectations
  return {
    data: response.data.ads.map(ad => ({
      ...ad,
      id: String(ad.id), // Convert ID to string
      seller: {
        id: String(ad.seller.id), // Convert ID to string
        name: ad.seller.name,
        rating: parseFloat(ad.seller.rating), // Convert string to number
        listingsCount: ad.seller.totalAds, // Map totalAds to listingsCount
        registrationDate: ad.seller.registeredAt, // Map registeredAt to registrationDate
      }
    })),
    total: response.data.pagination.totalItems,
    page: response.data.pagination.currentPage,
    totalPages: response.data.pagination.totalPages,
  };
};

/**
 * Get a single advertisement by ID
 */
export const getAdvertisementById = async (id: string): Promise<Advertisement> => {
  const controller = getAbortController(`advertisement-${id}`);

  const response = await api.get<any>(`/ads/${id}`, {
    signal: controller.signal,
  });

  abortControllers.delete(`advertisement-${id}`);

  // Transform backend response to match frontend types
  const ad = response.data;
  return {
    ...ad,
    id: String(ad.id), // Convert ID to string
    seller: {
      id: String(ad.seller.id), // Convert ID to string
      name: ad.seller.name,
      rating: parseFloat(ad.seller.rating), // Convert string to number
      listingsCount: ad.seller.totalAds, // Map totalAds to listingsCount
      registrationDate: ad.seller.registeredAt, // Map registeredAt to registrationDate
    }
  };
};

/**
 * Submit a moderation decision
 */
export const submitModerationDecision = async (
  id: string,
  decision: ModerationDecisionRequest
): Promise<void> => {
  // Route to the correct endpoint based on action
  let endpoint: string;
  if (decision.action === 'approve') {
    endpoint = `/ads/${id}/approve`;
  } else if (decision.action === 'reject') {
    endpoint = `/ads/${id}/reject`;
  } else {
    endpoint = `/ads/${id}/request-changes`;
  }

  await api.post<ApiResponse<void>>(endpoint, decision);
};

/**
 * Get moderation history for an advertisement
 * Note: The backend includes moderation history in the ad object,
 * so we fetch the ad and return its history
 */
export const getModerationHistory = async (id: string): Promise<ModerationAction[]> => {
  const ad = await getAdvertisementById(id);
  return ad.moderationHistory || [];
};

/**
 * Get statistics - combines data from multiple endpoints
 */
export const getStatistics = async (dateRange?: string): Promise<Statistics> => {
  const params = dateRange ? { period: dateRange } : {};

  // Call all stats endpoints in parallel
  const [summaryRes, activityRes, decisionsRes, categoriesRes] = await Promise.all([
    api.get<{
      totalReviewed: number;
      totalReviewedToday: number;
      totalReviewedThisWeek: number;
      totalReviewedThisMonth: number;
      approvedPercentage: number;
      rejectedPercentage: number;
      requestChangesPercentage: number;
      averageReviewTime: number;
    }>('/stats/summary', { params }),
    api.get<Array<{
      date: string;
      approved: number;
      rejected: number;
      requestChanges: number;
    }>>('/stats/chart/activity', { params }),
    api.get<{
      approved: number;
      rejected: number;
      requestChanges: number;
    }>('/stats/chart/decisions', { params }),
    api.get<Record<string, number>>('/stats/chart/categories', { params })
  ]);

  // Transform backend response to match frontend Statistics type
  const summary = summaryRes.data;
  const activity = activityRes.data;
  const decisions = decisionsRes.data;
  const categories = categoriesRes.data;

  // Backend returns totalReviewed based on the period requested
  // Map it to the appropriate field based on the period
  const period = dateRange || 'week';
  const totalReviewedValue = summary.totalReviewed;

  return {
    totalReviewed: {
      today: period === 'today' ? totalReviewedValue : summary.totalReviewedToday,
      week: period === 'week' ? totalReviewedValue : 0,
      month: period === 'month' ? totalReviewedValue : 0,
    },
    approvalPercentage: summary.approvedPercentage,
    rejectionPercentage: summary.rejectedPercentage,
    averageReviewTime: Math.round(summary.averageReviewTime / 60), // Convert seconds to minutes
    activityByDay: activity.map(day => ({
      date: day.date,
      count: day.approved + day.rejected + day.requestChanges
    })),
    decisionDistribution: {
      approved: decisions.approved,
      rejected: decisions.rejected,
      revision: decisions.requestChanges
    },
    reviewedByCategory: Object.entries(categories).map(([category, count]) => ({
      category: category as Category,
      count
    }))
  };
};

/**
 * Get available categories
 * Note: Backend doesn't have a categories endpoint, returning predefined list
 */
export const getCategories = async (): Promise<Category[]> => {
  // Return predefined categories matching backend
  return ['Электроника', 'Недвижимость', 'Транспорт', 'Работа', 'Услуги', 'Животные', 'Мода', 'Детское'];
};

export default api;
