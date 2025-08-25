export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';

export const getDirection = (locale: Locale): Direction => {
  return locale === 'ar' ? 'rtl' : 'ltr';
};

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    vehicles: 'Vehicles',
    wallet: 'Wallet',
    transactions: 'Transactions',
    support: 'Support',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    phone: 'Phone Number',
    name: 'Full Name',
    forgotPassword: 'Forgot Password?',
    
    // Landing Page
    heroTitle: 'Smart Toll Collection Made Easy',
    heroSubtitle: 'Experience seamless highway travel with automated toll payments, real-time balance tracking, and instant notifications.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Features
    automaticPayment: 'Automatic Payment',
    automaticPaymentDesc: 'Drive through toll gates without stopping. Payments are processed automatically using RFID technology.',
    realTimeTracking: 'Real-time Tracking',
    realTimeTrackingDesc: 'Monitor your balance, track crossings, and get instant notifications on your mobile device.',
    multiplePaymentMethods: 'Multiple Payment Options',
    multiplePaymentMethodsDesc: 'Top up your wallet using Vodafone Cash, Fawry, credit cards, or InstaPay.',
    
    // Dashboard
    walletBalance: 'Wallet Balance',
    recentTransactions: 'Recent Transactions',
    quickTopUp: 'Quick Top-up',
    addVehicle: 'Add Vehicle',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    vehicles: 'المركبات',
    wallet: 'المحفظة',
    transactions: 'المعاملات',
    support: 'الدعم',
    logout: 'تسجيل الخروج',
    
    // Auth
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    phone: 'رقم الهاتف',
    name: 'الاسم الكامل',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    
    // Landing Page
    heroTitle: 'نظام رسوم المرور الذكي والسهل',
    heroSubtitle: 'استمتع بتجربة سفر سلسة على الطرق السريعة مع الدفع الآلي لرسوم المرور وتتبع الرصيد في الوقت الفعلي والإشعارات الفورية.',
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    
    // Features  
    automaticPayment: 'الدفع التلقائي',
    automaticPaymentDesc: 'اعبر بوابات الرسوم دون توقف. يتم معالجة المدفوعات تلقائياً باستخدام تقنية RFID.',
    realTimeTracking: 'التتبع في الوقت الفعلي',
    realTimeTrackingDesc: 'راقب رصيدك، تتبع العبور، واحصل على إشعارات فورية على هاتفك المحمول.',
    multiplePaymentMethods: 'خيارات دفع متعددة',
    multiplePaymentMethodsDesc: 'اشحن محفظتك باستخدام فودافون كاش أو فوري أو البطاقات الائتمانية أو إنستاباي.',
    
    // Dashboard
    walletBalance: 'رصيد المحفظة',
    recentTransactions: 'المعاملات الأخيرة',
    quickTopUp: 'شحن سريع',
    addVehicle: 'إضافة مركبة',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    loading: 'جاري التحميل...',
    success: 'نجح',
    error: 'خطأ',
    confirm: 'تأكيد',
  },
};

export type TranslationKey = keyof typeof translations.en;

export const t = (key: TranslationKey, locale: Locale = 'en'): string => {
  return translations[locale][key] || translations.en[key] || key;
};