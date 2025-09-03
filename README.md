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

```css
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
- 📧 Email: 3laa.r.812@gmail.com
- 📱 Phone: +201033527373

---

**Made with ❤️ for modern transportation systems**
