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
    
    // Admin Dashboard
    admin_dashboard: 'Admin Dashboard',
    toll_management: 'Toll Management',
    dashboard_overview: 'Dashboard Overview',
    real_time_system_monitoring: 'Real-time System Monitoring',
    refresh: 'Refresh',
    today_entries: 'Today Entries',
    today_revenue: 'Today Revenue',
    success_rate: 'Success Rate',
    unpaid_entries: 'Unpaid Entries',
    from_yesterday: 'from yesterday',
    revenue_trend: 'Revenue Trend',
    hourly_revenue_breakdown: 'Hourly Revenue Breakdown',
    traffic_volume: 'Traffic Volume',
    entries_per_hour: 'Entries per Hour',
    device_status: 'Device Status',
    online: 'Online',
    offline: 'Offline',
    maintenance: 'Maintenance',
    device_locations: 'Device Locations',
    real_time_device_map: 'Real-time Device Map',
    interactive_map_placeholder: 'Interactive Map Coming Soon',
    maplibre_integration_required: 'MapLibre integration required',
    system_status: 'System Status',
    all_systems_operational: 'All Systems Operational',
    last_sync: 'Last Sync',
    '2_minutes_ago': '2 minutes ago',
    overview: 'Overview',
    traffic_live: 'Traffic Live',
    devices: 'Devices',
    entries: 'Entries',
    accounts: 'Accounts',
    pricing: 'Pricing',
    finance: 'Finance',
    reports: 'Reports',
    settings: 'Settings',
    live_traffic_monitoring: 'Live Traffic Monitor',
    real_time_toll_entries: 'Real-time Toll Entries',
    recent_entries: 'Recent Entries',
    search_placeholder: 'Search by vehicle, tag, or entry ID...',
    filters: 'Filters',
    export: 'Export',
    export_csv: 'Export CSV',
    bulk_actions: 'Bulk Actions',
    timestamp: 'Timestamp',
    tag_id: 'Tag ID',
    vehicle_id: 'Vehicle ID',
    gate: 'Gate',
    amount: 'Amount',
    status: 'Status',
    paid: 'Paid',
    unpaid: 'Unpaid',
    pending: 'Pending',
    failed: 'Failed',
    disputed: 'Disputed',
    actions: 'Actions',
    acknowledge: 'Acknowledge',
    flag: 'Flag',
    device_management: 'Device Management',
    toll_device_management: 'Toll Device Management',
    create_device: 'Create Device',
    add_device: 'Add Device',
    device_name: 'Device Name',
    location: 'Location',
    last_seen: 'Last Seen',
    firmware: 'Firmware',
    reboot: 'Reboot',
    send_message: 'Send Message',
    manage_toll_gate_devices: 'Manage Toll Gate Devices',
    create_new_device: 'Create New Device',
    provision_new_toll_gate_device: 'Provision New Toll Gate Device',
    enter_device_name: 'Enter device name',
    enter_location_address: 'Enter location address',
    provisioning_secret: 'Provisioning Secret',
    auto_generated: 'Auto-generated',
    total_devices: 'Total Devices',
    online_devices: 'Online Devices',
    offline_devices: 'Offline Devices',
    filters_and_actions: 'Filters and Actions',
    search_devices: 'Search devices...',
    all_statuses: 'All Statuses',
    devices_selected: 'devices selected',
    bulk_action: 'Bulk Action',
    maintenance_mode: 'Maintenance Mode',
    firmware_update: 'Firmware Update',
    enter_message: 'Enter message to send to devices...',
    execute: 'Execute',
    device_list: 'Device List',
    monitor_and_manage_devices: 'Monitor and Manage Devices',
    device: 'Device',
    battery: 'Battery',
    signal: 'Signal',
    performance: 'Performance',
    revenue: 'Revenue',
    real_time_entry_monitoring: 'Real-time Entry Monitoring',
    pause: 'Pause',
    resume: 'Resume',
    live_entries: 'Live Entries',
    live: 'Live',
    flagged_entries: 'Flagged Entries',
    avg_confidence: 'Avg. Confidence',
    search_plate_or_device: 'Search by plate or device...',
    all_devices: 'All Devices',
    live_entries_stream: 'Live Entries Stream',
    real_time_entry_feed: 'Real-time Entry Feed',
    vehicle_plate: 'Vehicle Plate',
    method: 'Payment Method',
    confidence: 'Confidence',
    image: 'Image',
    captured_at: 'Captured at',
    
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