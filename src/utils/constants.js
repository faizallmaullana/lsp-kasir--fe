// Application Constants

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories'
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id',
    DETAIL: '/transactions/:id',
    DAILY_SALES: '/transactions/daily-sales',
    REPORT: '/transactions/report'
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    SALES: '/reports/sales',
    PRODUCTS: '/reports/products',
    INVENTORY: '/reports/inventory',
    EXPORT: '/reports/export/:type'
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    DETAIL: '/users/:id'
  }
}

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
}

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.PENDING]: 'Pending',
  [TRANSACTION_STATUS.COMPLETED]: 'Selesai',
  [TRANSACTION_STATUS.CANCELLED]: 'Dibatalkan',
  [TRANSACTION_STATUS.REFUNDED]: 'Dikembalikan'
}

export const TRANSACTION_STATUS_COLORS = {
  [TRANSACTION_STATUS.PENDING]: 'warning',
  [TRANSACTION_STATUS.COMPLETED]: 'success',
  [TRANSACTION_STATUS.CANCELLED]: 'danger',
  [TRANSACTION_STATUS.REFUNDED]: 'info'
}

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  DIGITAL_WALLET: 'digital_wallet',
  BANK_TRANSFER: 'bank_transfer'
}

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Tunai',
  [PAYMENT_METHODS.CARD]: 'Kartu',
  [PAYMENT_METHODS.DIGITAL_WALLET]: 'Dompet Digital',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Transfer Bank'
}

// Product Categories
export const PRODUCT_CATEGORIES = {
  FOOD: 'makanan',
  BEVERAGE: 'minuman',
  SNACK: 'snack',
  ELECTRONICS: 'elektronik',
  CLOTHING: 'pakaian',
  BOOKS: 'buku',
  HEALTH: 'kesehatan',
  BEAUTY: 'kecantikan',
  SPORTS: 'olahraga',
  TOYS: 'mainan',
  OTHER: 'lainnya'
}

export const CATEGORY_LABELS = {
  [PRODUCT_CATEGORIES.FOOD]: 'Makanan',
  [PRODUCT_CATEGORIES.BEVERAGE]: 'Minuman',
  [PRODUCT_CATEGORIES.SNACK]: 'Snack',
  [PRODUCT_CATEGORIES.ELECTRONICS]: 'Elektronik',
  [PRODUCT_CATEGORIES.CLOTHING]: 'Pakaian',
  [PRODUCT_CATEGORIES.BOOKS]: 'Buku',
  [PRODUCT_CATEGORIES.HEALTH]: 'Kesehatan',
  [PRODUCT_CATEGORIES.BEAUTY]: 'Kecantikan',
  [PRODUCT_CATEGORIES.SPORTS]: 'Olahraga',
  [PRODUCT_CATEGORIES.TOYS]: 'Mainan',
  [PRODUCT_CATEGORIES.OTHER]: 'Lainnya'
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  STAFF: 'staff'
}

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.CASHIER]: 'Kasir',
  [USER_ROLES.STAFF]: 'Staff'
}

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'YYYY-MM-DD',
  FILENAME: 'YYYYMMDD_HHmm'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5242880, // 5MB in bytes
  ALLOWED_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
  IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif'],
  DOCUMENT_TYPES: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
}

// Validation Rules
export const VALIDATION = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  PRODUCT_NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500
}

// Currency
export const CURRENCY = {
  CODE: 'IDR',
  SYMBOL: 'Rp',
  LOCALE: 'id-ID'
}

// Tax
export const TAX = {
  DEFAULT_RATE: 11, // PPN 11%
  RATES: {
    VAT: 11,
    SERVICE: 10
  }
}

// Stock Levels
export const STOCK_LEVELS = {
  LOW_STOCK_THRESHOLD: 10,
  OUT_OF_STOCK_THRESHOLD: 0,
  REORDER_POINT: 5
}

// Report Types
export const REPORT_TYPES = {
  DAILY_SALES: 'daily_sales',
  WEEKLY_SALES: 'weekly_sales',
  MONTHLY_SALES: 'monthly_sales',
  PRODUCT_PERFORMANCE: 'product_performance',
  INVENTORY: 'inventory',
  CUSTOMER: 'customer'
}

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.DAILY_SALES]: 'Penjualan Harian',
  [REPORT_TYPES.WEEKLY_SALES]: 'Penjualan Mingguan',
  [REPORT_TYPES.MONTHLY_SALES]: 'Penjualan Bulanan',
  [REPORT_TYPES.PRODUCT_PERFORMANCE]: 'Performa Produk',
  [REPORT_TYPES.INVENTORY]: 'Inventori',
  [REPORT_TYPES.CUSTOMER]: 'Pelanggan'
}

// Export Formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json'
}

// Theme Colors
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#059669',
  WARNING: '#d97706',
  DANGER: '#dc2626',
  INFO: '#0ea5e9',
  LIGHT: '#f8fafc',
  DARK: '#1e293b'
}

// Layout
export const LAYOUT = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280
  }
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  SIDEBAR_STATE: 'sidebar_collapsed',
  CART_DATA: 'cart_data',
  RECENT_SEARCHES: 'recent_searches'
}

// API Response Messages
export const API_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki izin untuk mengakses resource ini.',
  NOT_FOUND: 'Data yang dicari tidak ditemukan.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  SUCCESS_CREATE: 'Data berhasil ditambahkan.',
  SUCCESS_UPDATE: 'Data berhasil diperbarui.',
  SUCCESS_DELETE: 'Data berhasil dihapus.',
  CONFIRM_DELETE: 'Apakah Anda yakin ingin menghapus data ini?'
}

// Feature Flags (untuk development)
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_EXPORT: true,
  ENABLE_BARCODE_SCANNER: true,
  ENABLE_CUSTOMER_MODULE: false,
  ENABLE_LOYALTY_PROGRAM: false
}

// Application Settings
export const APP_SETTINGS = {
  NAME: 'KasirApp',
  VERSION: '1.0.0',
  AUTHOR: 'Developer Team',
  DESCRIPTION: 'Sistem Kasir Modern untuk Bisnis',
  COPYRIGHT: '© 2024 KasirApp. All rights reserved.',
  SUPPORT_EMAIL: 'support@kasirapp.com'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800
}

// Cache Configuration
export const CACHE = {
  TTL: 300000, // 5 minutes
  KEYS: {
    PRODUCTS: 'products_cache',
    CATEGORIES: 'categories_cache',
    DASHBOARD_STATS: 'dashboard_stats_cache'
  }
}
