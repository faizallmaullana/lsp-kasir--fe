import axios from 'axios'

// Base URL untuk API - bisa diubah sesuai environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Membuat instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Token found and added to request:', token.substring(0, 20) + '...')
    } else {
      console.log('No auth token found in localStorage')
    }

    // Log request details
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data ? (config.data.image_base64 ? 
        { ...config.data, image_base64: `[${config.data.image_base64.length} chars]` } : 
        config.data
      ) : undefined
    })

    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - untuk menangani response dan error
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('Response Error:', error)

    // Handle error berdasarkan status code
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - hapus token dan redirect ke login
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
          
          // Redirect ke login jika tidak di halaman login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break

        case 403:
          // Forbidden
          console.error('Access denied')
          break

        case 404:
          // Not found
          console.error('Resource not found')
          break

        case 422:
          // Validation error
          console.error('Validation error:', data)
          break

        case 500:
          // Server error
          console.error('Server error')
          break

        default:
          console.error('Unknown error:', status, data)
      }

      // Return error dengan message yang user-friendly
      const errorMessage = data?.message || `Error ${status}: ${error.message}`
      return Promise.reject({
        ...error,
        message: errorMessage,
        status: status
      })
    } else if (error.request) {
      // Network error
      const networkError = {
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        status: 0,
        isNetworkError: true
      }
      return Promise.reject(networkError)
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'Terjadi kesalahan yang tidak diketahui',
        status: 0
      })
    }
  }
)

// Helper functions untuk berbagai HTTP methods
const api = {
  // GET request
  get: (url, params = {}) => {
    return apiClient.get(url, { params })
  },

  // POST request
  post: (url, data = {}) => {
    return apiClient.post(url, data)
  },

  // PUT request
  put: (url, data = {}) => {
    return apiClient.put(url, data)
  },

  // PATCH request
  patch: (url, data = {}) => {
    return apiClient.patch(url, data)
  },

  // DELETE request
  delete: (url) => {
    return apiClient.delete(url)
  },

  // Upload file
  upload: (url, formData) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Authentication helpers
const auth = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data

      // Simpan token dan data user
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))

      return response.data
    } catch (error) {
      throw error
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Hapus token dan data user
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token')
  }
}

// Products API
const productsAPI = {
  // Get all products
  getAll: (params = {}) => api.get('/products', params),

  // Get product by ID
  getById: (id) => api.get(`/products/${id}`),

  // Create new product
  create: (productData) => api.post('/products', productData),

  // Update product
  update: (id, productData) => api.put(`/products/${id}`, productData),

  // Delete product
  delete: (id) => api.delete(`/products/${id}`),

  // Search products
  search: (query) => api.get('/products/search', { q: query }),

  // Get products by category
  getByCategory: (category) => api.get('/products', { category }),

  // Update stock
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock })
}

// Transactions API
const transactionsAPI = {
  // Get all transactions
  getAll: (params = {}) => api.get('/transactions', params),

  // Get transaction by ID
  getById: (id) => api.get(`/transactions/${id}`),

  // Create new transaction
  create: (transactionData) => api.post('/transactions', transactionData),

  // Update transaction
  update: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),

  // Cancel transaction
  cancel: (id) => api.patch(`/transactions/${id}/cancel`),

  // Get daily sales
  getDailySales: (date) => api.get('/transactions/daily-sales', { date }),

  // Get sales report
  getSalesReport: (startDate, endDate) => api.get('/transactions/report', { 
    start_date: startDate, 
    end_date: endDate 
  })
}

// Reports API
const reportsAPI = {
  // Get dashboard stats
  getDashboardStats: () => api.get('/reports/dashboard'),

  // Get sales report
  getSalesReport: (params = {}) => api.get('/reports/sales', params),

  // Get product report
  getProductReport: (params = {}) => api.get('/reports/products', params),

  // Get inventory report
  getInventoryReport: () => api.get('/reports/inventory'),

  // Export report
  exportReport: (type, params = {}) => api.get(`/reports/export/${type}`, params)
}

// Categories API
const categoriesAPI = {
  // Get all categories
  getAll: () => api.get('/categories'),

  // Create category
  create: (categoryData) => api.post('/categories', categoryData),

  // Update category
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),

  // Delete category
  delete: (id) => api.delete(`/categories/${id}`)
}

// Users API (untuk management user)
const usersAPI = {
  // Get all users
  getAll: (params = {}) => api.get('/users', params),

  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),

  // Create user
  create: (userData) => api.post('/users', userData),

  // Update user
  update: (id, userData) => api.put(`/users/${id}`, userData),

  // Delete user
  delete: (id) => api.delete(`/users/${id}`),

  // Change password
  changePassword: (id, passwordData) => api.patch(`/users/${id}/password`, passwordData)
}

// Export default api client dan auth
export { apiClient as default, auth }
export { api }

// Export semua API modules
export {
  productsAPI,
  transactionsAPI,
  reportsAPI,
  categoriesAPI,
  usersAPI
}
