// Advertisement status types
export type AdvertisementStatus = 'pending' | 'approved' | 'rejected' | 'revision' | 'draft';

// Priority types
export type Priority = 'normal' | 'urgent';

// Category types (matching backend Russian names)
export type Category = 'Электроника' | 'Недвижимость' | 'Транспорт' | 'Работа' | 'Услуги' | 'Животные' | 'Мода' | 'Детское';

// Rejection reasons
export type RejectionReason =
  | 'prohibited-item'
  | 'wrong-category'
  | 'incorrect-description'
  | 'photo-issues'
  | 'suspected-fraud'
  | 'other';

// Advertisement interface
export interface Advertisement {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  status: AdvertisementStatus;
  priority: Priority;
  createdAt: string;
  images: string[];
  characteristics: Record<string, string>;
  seller: Seller;
  moderationHistory?: ModerationAction[];
}

// Seller interface
export interface Seller {
  id: string;
  name: string;
  rating: number;
  listingsCount: number;
  registrationDate: string;
}

// Moderation action interface
export interface ModerationAction {
  id: string;
  advertisementId: string;
  moderatorName: string;
  action: AdvertisementStatus;
  comment?: string;
  reason?: RejectionReason;
  timestamp: string;
}

// Moderation decision request
export interface ModerationDecisionRequest {
  action: 'approve' | 'reject' | 'revision';
  reason?: RejectionReason;
  comment?: string;
}

// Statistics interfaces
export interface Statistics {
  totalReviewed: {
    today: number;
    week: number;
    month: number;
  };
  approvalPercentage: number;
  rejectionPercentage: number;
  averageReviewTime: number; // in minutes
  activityByDay: DayActivity[];
  decisionDistribution: DecisionDistribution;
  reviewedByCategory: CategoryStats[];
}

export interface DayActivity {
  date: string;
  count: number;
}

export interface DecisionDistribution {
  approved: number;
  rejected: number;
  revision: number;
}

export interface CategoryStats {
  category: Category;
  count: number;
}

// Filter interfaces
export interface ListingFilters {
  status?: AdvertisementStatus[];
  category?: Category[];
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: 'date' | 'price' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark';
