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

  const response = await api.get<ApiResponse<PaginatedResponse<Advertisement>>>(
    '/advertisements',
    {
      params,
      signal: controller.signal,
    }
  );

  abortControllers.delete('advertisements');
  return response.data.data!;
};

/**
 * Get a single advertisement by ID
 */
export const getAdvertisementById = async (id: string): Promise<Advertisement> => {
  const controller = getAbortController(`advertisement-${id}`);

  const response = await api.get<ApiResponse<Advertisement>>(`/advertisements/${id}`, {
    signal: controller.signal,
  });

  abortControllers.delete(`advertisement-${id}`);
  return response.data.data!;
};

/**
 * Submit a moderation decision
 */
export const submitModerationDecision = async (
  id: string,
  decision: ModerationDecisionRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(`/advertisements/${id}/moderate`, decision);
};

/**
 * Get moderation history for an advertisement
 */
export const getModerationHistory = async (id: string): Promise<ModerationAction[]> => {
  const response = await api.get<ApiResponse<ModerationAction[]>>(
    `/advertisements/${id}/history`
  );
  return response.data.data!;
};

/**
 * Get statistics
 */
export const getStatistics = async (dateRange?: string): Promise<Statistics> => {
  const controller = getAbortController('statistics');

  const params = dateRange ? { range: dateRange } : {};

  const response = await api.get<ApiResponse<Statistics>>('/statistics', {
    params,
    signal: controller.signal,
  });

  abortControllers.delete('statistics');
  return response.data.data!;
};

/**
 * Get available categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<Category[]>>('/categories');
  return response.data.data!;
};

export default api;
