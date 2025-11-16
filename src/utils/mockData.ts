import type {
  Advertisement,
  Category,
  Statistics,
  Seller,
  ModerationAction,
} from '../types';

const categories: Category[] = [
  'electronics',
  'clothing',
  'furniture',
  'vehicles',
  'real-estate',
  'other',
];

const sellers: Seller[] = [
  {
    id: '1',
    name: 'Иван Петров',
    rating: 4.8,
    listingsCount: 45,
    registrationDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Анна Сидорова',
    rating: 4.9,
    listingsCount: 87,
    registrationDate: '2022-08-20',
  },
  {
    id: '3',
    name: 'Дмитрий Козлов',
    rating: 4.5,
    listingsCount: 23,
    registrationDate: '2023-05-10',
  },
  {
    id: '4',
    name: 'Елена Волкова',
    rating: 4.7,
    listingsCount: 62,
    registrationDate: '2022-11-05',
  },
];

const productTitles = {
  electronics: [
    'iPhone 14 Pro Max 256GB',
    'MacBook Pro M2 16"',
    'Samsung Galaxy S23 Ultra',
    'Sony PlayStation 5',
    'iPad Air 5th Gen',
  ],
  clothing: [
    'Мужская куртка North Face',
    'Женское платье Zara',
    'Кроссовки Nike Air Max',
    'Джинсы Levi\'s 501',
    'Пуховик Columbia',
  ],
  furniture: [
    'Диван угловой раскладной',
    'Кровать двуспальная с матрасом',
    'Шкаф-купе 3-дверный',
    'Обеденный стол со стульями',
    'Кресло офисное эргономичное',
  ],
  vehicles: [
    'Toyota Camry 2020',
    'BMW X5 2019',
    'Mercedes-Benz E-Class',
    'Volkswagen Polo 2021',
    'Hyundai Solaris 2022',
  ],
  'real-estate': [
    'Квартира 2-комн. 65м² центр',
    'Дом 150м² с участком',
    'Студия 30м² новостройка',
    'Коммерческое помещение 100м²',
    '3-комн. квартира 85м²',
  ],
  other: [
    'Детская коляска Cybex',
    'Велосипед горный Trek',
    'Книги классическая литература',
    'Настольная игра Монополия',
    'Гитара акустическая Yamaha',
  ],
};

const descriptions = {
  electronics:
    'В отличном состоянии, без царапин. Полный комплект с зарядным устройством и оригинальной упаковкой.',
  clothing:
    'Размер M, состояние новое. Не подошел по размеру. Куплено месяц назад.',
  furniture:
    'Состояние хорошее, есть незначительные потертости. Самовывоз из района Сокольники.',
  vehicles: 'Один хозяин, полная история обслуживания. ПТС оригинал. Торг уместен.',
  'real-estate':
    'Отличная планировка, ремонт 2022 года. Рядом метро, школы, парк. Документы готовы.',
  other: 'В отличном состоянии, использовалось аккуратно. Возможна доставка.',
};

const characteristics = {
  electronics: {
    Производитель: 'Apple',
    Состояние: 'Отличное',
    Гарантия: 'Есть',
    Комплектация: 'Полная',
  },
  clothing: {
    Размер: 'M',
    Материал: 'Хлопок',
    Состояние: 'Новое',
    Сезон: 'Демисезон',
  },
  furniture: {
    Материал: 'ЛДСП',
    Состояние: 'Хорошее',
    Цвет: 'Венге',
    Размеры: '200x100x80 см',
  },
  vehicles: {
    Год: '2020',
    Пробег: '45000 км',
    Коробка: 'Автомат',
    Привод: 'Передний',
  },
  'real-estate': {
    Площадь: '65 м²',
    Этаж: '5 из 12',
    Ремонт: 'Евроремонт',
    Балкон: 'Есть',
  },
  other: {
    Состояние: 'Хорошее',
    Производитель: 'Оригинал',
    Комплектация: 'Полная',
    Гарантия: 'Нет',
  },
};

// Generate mock images (placeholder URLs)
const generateImages = (): string[] => {
  const count = Math.floor(Math.random() * 3) + 3; // 3-5 images
  return Array.from({ length: count }, (_, i) => `https://via.placeholder.com/800x600?text=Image+${i + 1}`);
};

// Generate random date within last 30 days
const generateRandomDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

// Generate mock advertisement
export const generateMockAdvertisement = (id: number): Advertisement => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const titles = productTitles[category];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const statuses: Advertisement['status'][] = ['pending', 'approved', 'rejected', 'revision'];

  return {
    id: String(id),
    title,
    description: descriptions[category],
    price: Math.floor(Math.random() * 900000) + 10000, // 10k - 1M rubles
    category,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: Math.random() > 0.8 ? 'urgent' : 'normal',
    createdAt: generateRandomDate(),
    images: generateImages(),
    characteristics: characteristics[category],
    seller: sellers[Math.floor(Math.random() * sellers.length)],
  };
};

// Generate mock moderation history
export const generateMockModerationHistory = (adId: string): ModerationAction[] => {
  const actions: ModerationAction[] = [];
  const count = Math.floor(Math.random() * 3) + 1;

  const moderators = ['Алексей Модератов', 'Мария Проверкина', 'Игорь Контролёв'];
  const statuses: ModerationAction['action'][] = ['pending', 'approved', 'rejected', 'revision'];

  for (let i = 0; i < count; i++) {
    actions.push({
      id: `${adId}-action-${i}`,
      advertisementId: adId,
      moderatorName: moderators[Math.floor(Math.random() * moderators.length)],
      action: statuses[Math.floor(Math.random() * statuses.length)],
      comment: i === 0 ? 'Первичная проверка' : 'Повторная проверка',
      timestamp: generateRandomDate(),
    });
  }

  return actions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate mock statistics
export const generateMockStatistics = (): Statistics => {
  return {
    totalReviewed: {
      today: Math.floor(Math.random() * 50) + 20,
      week: Math.floor(Math.random() * 300) + 100,
      month: Math.floor(Math.random() * 1000) + 500,
    },
    approvalPercentage: Math.floor(Math.random() * 30) + 65, // 65-95%
    rejectionPercentage: Math.floor(Math.random() * 15) + 5, // 5-20%
    averageReviewTime: Math.floor(Math.random() * 10) + 3, // 3-13 minutes
    activityByDay: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 100) + 20,
      };
    }),
    decisionDistribution: {
      approved: Math.floor(Math.random() * 500) + 300,
      rejected: Math.floor(Math.random() * 100) + 50,
      revision: Math.floor(Math.random() * 80) + 20,
    },
    reviewedByCategory: categories.map((cat) => ({
      category: cat,
      count: Math.floor(Math.random() * 200) + 50,
    })),
  };
};

// Generate bulk mock advertisements
export const generateMockAdvertisements = (count: number = 100): Advertisement[] => {
  return Array.from({ length: count }, (_, i) => generateMockAdvertisement(i + 1));
};
