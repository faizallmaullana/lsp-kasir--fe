import { api } from '../config/axios.js'

/**
 * Authentication Service
 * Provides methods for user authentication and token management
 */
class AuthService {
  /**
   * Login user with email and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with user data and token
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.STATUS === 'OK') {
        const { user, token } = response.data.DATA
        
        // Store token in localStorage
        this.setToken(token)
        
        // Store user data
        this.setUser(user)
        
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Login failed',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle different error responses
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid credentials format',
              status: 'BAD_REQUEST'
            }
          case 401:
            return {
              success: false,
              error: 'Email atau password salah',
              status: 'UNAUTHORIZED'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Server error occurred',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Login failed',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Network error or server unavailable',
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Refresh user token
   * @returns {Promise<Object>} Refresh token response
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      
      if (response.data.STATUS === 'OK') {
        const { token } = response.data.DATA
        
        // Update stored token
        this.setToken(token)
        
        return {
          success: true,
          data: { token },
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: 'Token refresh failed',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 401:
            // Token expired or invalid, logout user
            this.logout()
            return {
              success: false,
              error: 'Session expired, please login again',
              status: 'UNAUTHORIZED'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to refresh token',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Token refresh failed',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Network error or server unavailable',
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    // Redirect to login page if needed
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  /**
   * Store authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('auth_token', token)
  }

  /**
   * Get stored authentication token
   * @returns {string|null} JWT token or null if not found
   */
  getToken() {
    return localStorage.getItem('auth_token')
  }

  /**
   * Store user data
   * @param {Object} user - User data object
   */
  setUser(user) {
    localStorage.setItem('user_data', JSON.stringify(user))
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data object or null if not found
   */
  getUser() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    const token = this.getToken()
    
    if (!token) {
      return false
    }
    
    try {
      // Basic JWT token validation (check if not expired)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      return payload.exp > currentTime
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  /**
   * Get user role from stored data
   * @returns {string|null} User role or null
   */
  getUserRole() {
    const user = this.getUser()
    return user ? user.role : null
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has the specified role
   */
  hasRole(role) {
    const userRole = this.getUserRole()
    return userRole === role
  }

  /**
   * Get authorization header for API requests
   * @returns {Object|null} Authorization header object or null
   */
  getAuthHeader() {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : null
  }
}

// Create and export a singleton instance
const authService = new AuthService()
export default authService

// Also export the class for testing purposes
export { AuthService }
