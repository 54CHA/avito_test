# Avito Advertisement Moderation System

A modern, production-ready web application for moderating advertisements on the Avito platform. Built with React 18, TypeScript, Material-UI, and Tailwind CSS.

## 🚀 Features

### Core Features
- **📋 Listings List Page** (`/list`)
  - Grid view of advertisement cards
  - Multi-select status and category filters
  - Price range filtering
  - Real-time search by title
  - Sorting by date, price, and priority
  - Pagination (10 items per page)
  - Total count display

- **🔍 Detail Page** (`/item/:id`)
  - Image gallery with navigation
  - Full product description and characteristics
  - Seller information (name, rating, listings count, registration date)
  - Complete moderation history timeline
  - Moderation action panel (Approve/Reject/Revision)
  - Rejection modal with predefined reasons
  - Previous/Next navigation between items

- **📊 Statistics Page** (`/stats`)
  - Metric cards (total reviewed, approval %, rejection %, avg review time)
  - Activity bar chart (last 7 days)
  - Decision distribution pie chart
  - Reviewed by category bar chart
  - Date range filter (today/week/month)

### Bonus Features
- ⌨️ **Keyboard Shortcuts**
  - `A` - Approve advertisement
  - `D` - Reject advertisement
  - `←` - Previous item
  - `→` - Next item
  - `/` - Focus search (disabled in input fields)

- 🌓 **Dark Theme Support**
  - Theme toggle in header
  - Preference saved to localStorage
  - Smooth transitions

- 🎨 **Animations**
  - Card hover effects
  - Smooth page transitions
  - Loading progress indicators

- 📱 **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Adaptive grid layouts

## 🛠 Tech Stack

### Required Technologies
- **React 18.2** - Modern UI library
- **TypeScript 5.3** - Type-safe development
- **Vite 5.1** - Fast build tool and dev server
- **React Router DOM 6.22** - Client-side routing
- **Material-UI (MUI) 5.15** - Comprehensive UI component library
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios 1.6** - HTTP client with interceptors
- **Docker** - Containerization

### Additional Libraries
- **@mui/x-charts** - Professional charts for statistics
- **@emotion/react & @emotion/styled** - CSS-in-JS (required by MUI)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Enhanced type checking

## 📦 Installation

### Prerequisites
- Node.js v20
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd avito_test
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🐳 Docker Setup

### Build Docker Image
```bash
docker build -t avito-moderation-client .
```

### Run Docker Container
```bash
docker run -p 5173:5173 \
  -e VITE_API_URL=http://host.docker.internal:3000/api \
  avito-moderation-client
```

### Using Docker Compose
```bash
docker-compose up --build
```

To stop:
```bash
docker-compose down
```

## 🏗 Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── ErrorDisplay.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── detail/          # Detail page components
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ModerationActions.tsx
│   │   │   ├── ModerationHistory.tsx
│   │   │   ├── RejectionModal.tsx
│   │   │   └── SellerInfo.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── listings/        # Listings page components
│   │   │   ├── AdvertisementCard.tsx
│   │   │   └── FiltersPanel.tsx
│   │   └── stats/           # Statistics components
│   │       └── MetricCard.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx # Dark theme provider
│   ├── hooks/
│   │   ├── useDebounce.ts   # Debounce hook for search
│   │   └── useKeyboardShortcuts.ts
│   ├── pages/
│   │   ├── DetailPage.tsx
│   │   ├── ListingsPage.tsx
│   │   └── StatsPage.tsx
│   ├── services/
│   │   └── api.ts           # Axios instance & API calls
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── formatters.ts    # Format helpers
│   │   └── mockData.ts      # Mock data generator
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔌 API Integration

The application is designed to connect to a separate backend server. Configure the API endpoint via the `VITE_API_URL` environment variable.

### Expected API Endpoints

```typescript
GET    /advertisements          # Get all listings with filters
GET    /advertisements/:id      # Get single listing
POST   /advertisements/:id/moderate  # Submit moderation decision
GET    /advertisements/:id/history   # Get moderation history
GET    /statistics              # Get statistics
GET    /categories              # Get available categories
```

### API Request/Response Examples

**Get Advertisements**
```typescript
GET /advertisements?page=1&limit=10&status=pending&category=electronics

Response: {
  success: true,
  data: {
    data: Advertisement[],
    total: number,
    page: number,
    totalPages: number
  }
}
```

**Submit Moderation Decision**
```typescript
POST /advertisements/:id/moderate
Body: {
  action: "approve" | "reject" | "revision",
  reason?: "prohibited-item" | "wrong-category" | ...,
  comment?: string
}
```

## 🎨 Material-UI + Tailwind Integration

This project uses both Material-UI and Tailwind CSS:

- **Material-UI**: Used for complex interactive components (Cards, Modals, Charts, Buttons, etc.)
- **Tailwind CSS**: Used for layout, spacing, and utility classes

### Configuration
- Tailwind's `preflight` is disabled to prevent conflicts with MUI
- `important: '#root'` ensures Tailwind utilities can override MUI styles when needed
- Both systems work harmoniously without style conflicts

## 🧪 Mock Data

The application includes a comprehensive mock data generator for development and testing:

- **generateMockAdvertisements()** - Creates 100 sample advertisements
- **generateMockModerationHistory()** - Creates moderation action history
- **generateMockStatistics()** - Creates realistic statistics data

To replace with real API calls, update the services in `src/services/api.ts`.

## 🔑 Key Design Decisions

### Technology Choices

1. **Vite over Create React App**
   - Faster development server with HMR
   - Better build performance
   - Native ESM support

2. **Material-UI for Components**
   - Production-ready components
   - Accessibility built-in
   - Comprehensive theming system
   - Charts library (@mui/x-charts)

3. **Tailwind for Utilities**
   - Rapid prototyping
   - Consistent spacing/sizing
   - Minimal custom CSS needed

4. **TypeScript Strict Mode**
   - Enhanced type safety
   - Better IDE support
   - Fewer runtime errors

5. **Axios over Fetch**
   - Request/response interceptors
   - Automatic JSON transformation
   - Better error handling
   - Request cancellation support

### Architecture Decisions

1. **Component Organization**
   - Feature-based folder structure
   - Reusable common components
   - Clear separation of concerns

2. **State Management**
   - React hooks for local state
   - Context API for theme
   - No external state library needed (app complexity is moderate)

3. **Request Cancellation**
   - AbortController for navigation changes
   - Prevents memory leaks
   - Better UX during fast navigation

4. **Debounced Search**
   - Custom hook implementation
   - Reduces unnecessary re-renders
   - Better performance

## ✅ Features Checklist

### Core Features
- ✅ Listings list with grid view
- ✅ Multi-select filters (status, category)
- ✅ Price range filter
- ✅ Search functionality
- ✅ Sorting (date, price, priority)
- ✅ Pagination
- ✅ Detail page with image gallery
- ✅ Seller information display
- ✅ Moderation history timeline
- ✅ Moderation actions (Approve/Reject/Revision)
- ✅ Rejection modal with reasons
- ✅ Statistics page with metrics
- ✅ Charts (Bar, Pie)
- ✅ Previous/Next navigation

### Bonus Features
- ✅ Keyboard shortcuts
- ✅ Dark theme toggle
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling
- ✅ Docker containerization
- ✅ TypeScript strict mode
- ✅ ESLint & Prettier
- ✅ Request cancellation

## 🚧 Known Limitations

1. **Mock Data**: Currently using generated mock data. Replace with actual API calls in production.
2. **Authentication**: Not implemented (assumes user is logged in).
3. **Image Uploads**: Uses placeholder images.
4. **Persistence**: Moderation actions are logged but not persisted (needs backend).

## 🔒 Security Considerations

- Input validation on all forms
- XSS protection via React's built-in escaping
- CSRF tokens should be added when connecting to real API
- Environment variables for sensitive configuration
- Security headers in nginx configuration

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created as a technical assignment for Avito.

## 👨‍💻 Author

Created as part of the Avito Frontend technical assignment.

---

**Note**: This is a frontend-only application. It requires a separate backend server to be fully functional. The application includes comprehensive mock data for development and demonstration purposes.
