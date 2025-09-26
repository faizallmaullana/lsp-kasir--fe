import { api as apiClient } from '../config/axios.js'

/**
 * Profile Service
 * Provides methods for profile management operations based on the actual API specification
 */
class ProfileService {
  /**
   * Get current user's basic info and their profiles
   * @returns {Promise<Object>} Current user profile response
   */
  async getMe() {
    try {
      const response = await apiClient.get('/profile/me')
      
      return {
        success: true,
        data: response.data,
        message: 'Profile loaded successfully'
      }
    } catch (error) {
      console.error('Get current user profile error:', error)
      
      if (error.response) {
        const { status } = error.response
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 404:
            return {
              success: false,
              error: 'User not found',
              status: 'NOT_FOUND'
            }
          default:
            return {
              success: false,
              error: 'Failed to load profile',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Network error or server unavailable: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Create a profile for the current user
   * @param {Object} profileData - Profile data
   * @param {string} profileData.name - Name (required)
   * @param {string} profileData.contact - Contact (required)
   * @param {string} profileData.address - Address (required)
   * @param {string} profileData.image_url - Image URL (optional)
   * @returns {Promise<Object>} Create profile response
   */
  async createProfile(profileData) {
    try {
      console.log('Creating profile with data:', profileData)
      
      const response = await apiClient.post('/profile', profileData)
      
      if (response.data.STATUS === 'created') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE || 'Profile created successfully'
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to create profile',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Create profile error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid profile data',
              status: 'BAD_REQUEST'
            }
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to create profile',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to create profile',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Network error or server unavailable: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Update a profile belonging to the current user
   * @param {string} profileId - Profile ID
   * @param {Object} profileData - Updated profile data
   * @param {string} profileData.name - Name (optional)
   * @param {string} profileData.contact - Contact (optional)  
   * @param {string} profileData.address - Address (optional)
   * @param {string} profileData.image_url - Image URL (optional)
   * @returns {Promise<Object>} Update profile response
   */
  async updateProfile(profileId, profileData) {
    try {
      console.log('Updating profile:', profileId, 'with data:', profileData)
      
      const response = await apiClient.put(`/profile/${profileId}`, profileData)
      
      if (response.data.STATUS === 'updated') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE || 'Profile updated successfully'
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to update profile',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid profile data',
              status: 'BAD_REQUEST'
            }
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 404:
            return {
              success: false,
              error: 'Profile not found or not owned by user',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to update profile',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to update profile',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Network error or server unavailable: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Delete a profile belonging to the current user
   * @param {string} profileId - Profile ID
   * @returns {Promise<Object>} Delete profile response
   */
  async deleteProfile(profileId) {
    try {
      console.log('Deleting profile:', profileId)
      
      const response = await apiClient.delete(`/profile/${profileId}`)
      
      if (response.data.STATUS === 'deleted') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE || 'Profile deleted successfully'
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to delete profile',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Delete profile error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 404:
            return {
              success: false,
              error: 'Profile not found or not owned by user',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to delete profile',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to delete profile',
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
   * Update the current user's email
   * @param {string} email - New email address
   * @returns {Promise<Object>} Update email response
   */
  async updateEmail(email) {
    try {
      console.log('Updating email to:', email)
      
      const response = await apiClient.put('/profile/email', { email })
      
      if (response.data.STATUS === 'email updated') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE || 'Email updated successfully'
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to update email',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Update email error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid email address',
              status: 'BAD_REQUEST'
            }
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 404:
            return {
              success: false,
              error: 'User not found',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to update email',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to update email',
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

}

// Create and export a singleton instance
const profileService = new ProfileService()
export default profileService

// Also export the class for testing purposes
export { ProfileService }
