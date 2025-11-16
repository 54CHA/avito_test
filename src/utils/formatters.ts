/**
 * Format price in Russian rubles
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to Russian locale
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format date and time to Russian locale
 */
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'только что';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${getMinutesWord(minutes)} назад`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${getHoursWord(hours)} назад`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${getDaysWord(days)} назад`;
  } else {
    return formatDate(date);
  }
};

// Helper functions for Russian pluralization
const getMinutesWord = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'минуту';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'минуты';
  return 'минут';
};

const getHoursWord = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'час';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'часа';
  return 'часов';
};

const getDaysWord = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'дня';
  return 'дней';
};

/**
 * Get status label in Russian
 */
export const getStatusLabel = (
  status: 'pending' | 'approved' | 'rejected' | 'revision' | 'draft'
): string => {
  const labels = {
    pending: 'На модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    revision: 'На доработку',
    draft: 'На доработку',
  };
  return labels[status];
};

/**
 * Get priority label in Russian
 */
export const getPriorityLabel = (priority: 'normal' | 'urgent'): string => {
  return priority === 'urgent' ? 'Срочно' : 'Обычно';
};

/**
 * Get category label in Russian
 * Categories are already in Russian from the backend
 */
export const getCategoryLabel = (category: string): string => {
  // Categories are already in Russian, just return them
  return category;
};

/**
 * Get rejection reason label in Russian
 */
export const getRejectionReasonLabel = (
  reason:
    | 'prohibited-item'
    | 'wrong-category'
    | 'incorrect-description'
    | 'photo-issues'
    | 'suspected-fraud'
    | 'other'
): string => {
  const labels = {
    'prohibited-item': 'Запрещенный товар',
    'wrong-category': 'Неверная категория',
    'incorrect-description': 'Некорректное описание',
    'photo-issues': 'Проблемы с фото',
    'suspected-fraud': 'Подозрение на мошенничество',
    other: 'Другое',
  };
  return labels[reason];
};
