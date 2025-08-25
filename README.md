# Smart Toll Collection System 🚗💳

A modern, bilingual (Arabic RTL + English) Smart Toll Collection System frontend built with React, TypeScript, and TailwindCSS. This system manages automated toll gate payments using RFID technology, real-time balance tracking, and seamless user experience.

## 🌟 Features

### User Experience
- **Bilingual Support**: Full Arabic (RTL) and English support with language toggle
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Modern UI**: Clean design with smart gradients and toll-specific theming
- **Accessibility**: High contrast ratios and screen reader support

### Authentication & Security
- **JWT Authentication**: Access/refresh token system with httpOnly cookies
- **Phone OTP**: Secure phone-based authentication
- **Password Recovery**: Forgot password functionality
- **Session Management**: Automatic token refresh and logout

### Core Functionality
- **Wallet Management**: Real-time balance tracking and top-up options
- **Vehicle Management**: Add/edit vehicles with RFID tag linking
- **Transaction History**: Detailed payment records with filtering
- **Payment Methods**: Multiple payment options (Vodafone Cash, Fawry, Cards, InstaPay)
- **Real-time Notifications**: Instant payment confirmations and alerts

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design tokens
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + Custom components
- **Internationalization**: Custom i18n system
- **Icons**: Lucide React
- **Build Tool**: Vite with SWC

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-toll-collection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=Smart Toll Collection

# Authentication
VITE_JWT_SECRET=your-jwt-secret-key

# Payment Integration
VITE_VODAFONE_CASH_API=your-vodafone-api-key
VITE_FAWRY_API=your-fawry-api-key
```

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page with hero and features
- `/login` - User authentication
- `/signup` - Account registration
- `/forgot-password` - Password recovery

### Protected Routes (Authenticated)
- `/dashboard` - User dashboard with balance and recent transactions
- `/vehicles` - Vehicle management
- `/wallet` - Wallet and payment methods
- `/transactions` - Transaction history
- `/support` - Support and dispute management
- `/profile` - User profile settings

### Admin Routes (Future)
- `/admin` - Admin dashboard
- `/admin/devices` - Device management
- `/admin/transactions` - Transaction management
- `/admin/users` - User management

## 🎨 Design System

### Colors
- **Primary**: Smart blue (#2563EB) for trust and technology
- **Success**: Green (#059669) for successful payments
- **Warning**: Amber (#D97706) for alerts
- **Toll Gate**: Gold (#EAB308) for toll-specific elements

### Typography
- **English**: Inter font family
- **Arabic**: Noto Sans Arabic for proper RTL support

### Components
- Custom button variants (hero, success, wallet, topup, vehicle)
- Responsive card layouts with gradients
- RTL-aware spacing and animations

## 🌍 Internationalization

The app supports full bilingual functionality:

```typescript
// Usage example
import { t } from '@/lib/i18n';
import { useI18nStore } from '@/stores/useI18nStore';

const { locale } = useI18nStore();
const title = t('heroTitle', locale); // Auto-switches between EN/AR
```

### Adding New Translations
1. Add keys to `src/lib/i18n.ts`
2. Update both English and Arabic translations
3. Use the `t()` function in components

## 📡 API Integration

### Mock API Endpoints
Current implementation uses mock APIs. Replace with real backend:

```typescript
// Authentication
POST /auth/signup
POST /auth/login
POST /auth/refresh

// User Management
GET /user/profile
PATCH /user/profile

// Wallet & Payments
GET /wallet
POST /wallet/topup
PATCH /wallet/auto-topup

// Vehicles
GET /vehicles
POST /vehicles
PATCH /vehicles/:id
DELETE /vehicles/:id

// Transactions
GET /transactions
GET /transactions/:id
```

### Real API Integration
Replace mock functions in `src/stores/useAuthStore.ts` and create API client in `src/lib/api.ts`.

## 🧪 Testing

### Demo Credentials
- **Phone**: +201234567890
- **Password**: password123
- **OTP**: 1234 (for demo purposes)

### Test Payment Flow
1. Sign up with demo credentials
2. Navigate to wallet top-up
3. Select payment method
4. Use test amounts (50, 100, 200, 500 EGP)

## 📦 Project Structure

```
src/
├── assets/           # Images and static files
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (buttons, cards, etc.)
│   ├── Header.tsx   # Navigation header
│   ├── Hero.tsx     # Landing page hero section
│   └── Features.tsx # Feature showcase
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
│   ├── i18n.ts     # Internationalization setup
│   └── utils.ts    # Helper utilities
├── pages/           # Page components
│   ├── Index.tsx   # Landing page
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── Dashboard.tsx
├── stores/          # Zustand state stores
│   ├── useAuthStore.ts    # Authentication state
│   └── useI18nStore.ts    # Internationalization state
├── App.tsx          # Main app component
├── main.tsx         # App entry point
└── index.css        # Global styles and design tokens
```

## 🔐 Security Features

- **CSRF Protection**: Token-based authentication
- **XSS Prevention**: Input sanitization and validation
- **Secure Cookies**: HttpOnly cookies for tokens
- **Form Validation**: Zod schema validation
- **Phone Verification**: OTP-based registration

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@smarttoll.com
- 📱 Phone: +20-123-456-7890
- 💬 Discord: [Smart Toll Community](https://discord.gg/smarttoll)

---

**Made with ❤️ for modern transportation systems**