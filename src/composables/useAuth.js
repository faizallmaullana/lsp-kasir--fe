import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService.js'

/**
 * Authentication composable
 * Provides reactive authentication state and methods
 */
export function useAuth() {
  const router = useRouter()
  
  // Reactive state
  const loading = ref(false)
  const error = ref(null)
  
  // Computed properties
  const isAuthenticated = computed(() => authService.isAuthenticated())
  const user = computed(() => authService.getUser())
  const userRole = computed(() => authService.getUserRole())
  
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email  
   * @param {string} credentials.password - User password
   * @returns {Promise<boolean>} Success status
   */
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.login(credentials)
      
      if (result.success) {
        // Redirect to dashboard after successful login
        router.push('/dashboard')
        return true
      } else {
        error.value = result.error
        return false
      }
    } catch (err) {
      error.value = 'Login failed. Please try again.'
      console.error('Login error:', err)
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Logout user
   */
  const logout = () => {
    authService.logout()
    router.push('/login')
  }
  
  /**
   * Refresh authentication token
   * @returns {Promise<boolean>} Success status
   */
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken()
      
      if (result.success) {
        return true
      } else {
        if (result.status === 'UNAUTHORIZED') {
          // Token expired, redirect to login
          logout()
        }
        return false
      }
    } catch (err) {
      console.error('Token refresh error:', err)
      return false
    }
  }
  
  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has the role
   */
  const hasRole = (role) => {
    return authService.hasRole(role)
  }
  
  /**
   * Clear authentication error
   */
  const clearError = () => {
    error.value = null
  }
  
  /**
   * Initialize auth state (call on app mount)
   */
  const initializeAuth = () => {
    // Check if user is authenticated and redirect accordingly
    if (isAuthenticated.value) {
      // User is logged in, ensure they're not on login page
      if (router.currentRoute.value.path === '/login') {
        router.push('/dashboard')
      }
    } else {
      // User is not logged in, redirect to login if on protected route
      const publicRoutes = ['/login', '/']
      if (!publicRoutes.includes(router.currentRoute.value.path)) {
        router.push('/login')
      }
    }
  }
  
  return {
    // State
    loading,
    error,
    
    // Computed
    isAuthenticated,
    user,
    userRole,
    
    // Methods
    login,
    logout,
    refreshToken,
    hasRole,
    clearError,
    initializeAuth
  }
}

/**
 * Authentication guard composable for route protection
 */
export function useAuthGuard() {
  const { isAuthenticated, hasRole } = useAuth()
  
  /**
   * Check if route requires authentication
   * @param {Object} to - Target route
   * @returns {boolean|string} True if allowed, redirect path if not
   */
  const canAccessRoute = (to) => {
    // Check if route requires authentication
    if (to.meta?.requiresAuth && !isAuthenticated.value) {
      return '/login'
    }
    
    // Check if route requires specific role
    if (to.meta?.requiresRole) {
      const requiredRole = to.meta.requiresRole
      if (!hasRole(requiredRole)) {
        return '/dashboard' // Redirect to dashboard if no permission
      }
    }
    
    // Check if authenticated user tries to access login page
    if (to.path === '/login' && isAuthenticated.value) {
      return '/dashboard'
    }
    
    return true
  }
  
  return {
    canAccessRoute
  }
}
