import { api as apiClient } from '../config/axios.js'

/**
 * Items Service
 * Provides methods for CRUD operations on items/products
 */
class ItemsService {
  /**
   * Get all items with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/items', { params })
      
      if (response.data.STATUS === 'OK') {
        // Parsing DATA array dari response API backend
        const items = Array.isArray(response.data.DATA) ? response.data.DATA : []
        
        // Convert is_available to stock_status untuk compatibility dengan UI
        const processedItems = items.map(item => ({
          ...item,
          stock_status: item.is_available ? 'available' : 'unavailable'
        }))
        
        return {
          success: true,
          data: processedItems,
          pagination: response.data.pagination || {
            page: 1,
            count: processedItems.length,
            total: processedItems.length,
            hasMore: false
          },
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch items from backend',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      // Hanya log error, tidak gunakan fallback data
      console.error('Backend API error:', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: []
      }
    }
  }

  /**
   * Get item by ID
   * @param {string} id - Item UUID
   * @returns {Promise<Object>} Item details response
   */
  async getById(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Item ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.get(`/items/${id}`)
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.MESSAGE || 'Item not found',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Get item by ID error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 404:
            return {
              success: false,
              error: data.MESSAGE || 'Item not found',
              status: 'NOT_FOUND'
            }
          default:
            return {
              success: false,
              error: 'Failed to fetch item',
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
   * Create new item
   * @param {Object} itemData - Item data
   * @param {string} itemData.item_name - Item name (required)
   * @param {boolean} itemData.is_available - Availability status (optional, default: true)
   * @param {number} itemData.price - Item price (required)
   * @param {string} itemData.description - Item description (optional)
   * @param {string} itemData.image_url - Item image URL (optional)
   * @returns {Promise<Object>} Create item response
   */
  async create(itemData) {
    try {
      // Validate required fields
      if (!itemData.item_name || !itemData.price) {
        return {
          success: false,
          error: 'Item name and price are required',
          status: 'BAD_REQUEST'
        }
      }

      // Set defaults
      const data = {
        is_available: true,
        ...itemData
      }

      const response = await apiClient.post('/items', data)
      
      if (response.data.STATUS === 'created') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to create item',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (create):', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid item data',
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
              error: data.ERROR || 'Failed to create item on backend',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to create item on backend',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Update existing item
   * @param {string} id - Item UUID
   * @param {Object} itemData - Updated item data
   * @param {string} itemData.item_name - Item name (optional)
   * @param {boolean} itemData.is_available - Availability status (optional)
   * @param {number} itemData.price - Item price (optional)
   * @param {string} itemData.description - Item description (optional)
   * @param {string} itemData.image_url - Item image URL (optional)
   * @returns {Promise<Object>} Update item response
   */
  async update(id, itemData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Item ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.put(`/items/${id}`, itemData)
      
      if (response.data.STATUS === 'updated') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || response.data.MESSAGE || 'Failed to update item',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Update item error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid item data',
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
              error: data.MESSAGE || 'Item not found',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to update item',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to update item',
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
   * Delete item (soft delete)
   * @param {string} id - Item UUID
   * @returns {Promise<Object>} Delete item response
   */
  async delete(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Item ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.delete(`/items/${id}`)
      
      if (response.data.STATUS === 'deleted') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to delete item',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Delete item error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to delete item',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to delete item',
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
   * Search items by name or description
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Search results
   */
  async search(query, params = {}) {
    try {
      const searchParams = {
        search: query,
        ...params
      }
      
      return await this.getAll(searchParams)
    } catch (error) {
      console.error('Search items error:', error)
      return {
        success: false,
        error: 'Failed to search items',
        status: 'SEARCH_ERROR'
      }
    }
  }

  /**
   * Update item availability status
   * @param {string} id - Item ID
   * @param {boolean} isAvailable - New availability status
   * @returns {Promise<Object>} Update response
   */
  async updateAvailability(id, isAvailable) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Item ID is required',
          status: 'BAD_REQUEST'
        }
      }

      // Menggunakan endpoint PUT /items/:id sesuai API spec
      const data = {
        is_available: isAvailable
      }

      const response = await apiClient.put(`/items/${id}`, data)
      
      if (response.data.STATUS === 'updated') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE || `Item ${isAvailable ? 'marked as available' : 'marked as unavailable'}`
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to update item availability',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (updateAvailability):', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid request data',
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
              error: 'Item not found',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to update availability on backend',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to update availability on backend',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Get items by availability status
   * @param {boolean} isAvailable - Availability status
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Filtered items
   */
  async getByAvailability(isAvailable, params = {}) {
    try {
      const filterParams = {
        is_available: isAvailable,
        ...params
      }
      
      return await this.getAll(filterParams)
    } catch (error) {
      console.error('Get items by availability error:', error)
      return {
        success: false,
        error: 'Failed to filter items by availability',
        status: 'FILTER_ERROR'
      }
    }
  }

  /**
   * Validate item data
   * @param {Object} itemData - Item data to validate
   * @returns {Object} Validation result
   */
  validateItemData(itemData) {
    const errors = []
    
    if (!itemData.item_name || itemData.item_name.trim() === '') {
      errors.push('Item name is required')
    }
    
    if (itemData.price === undefined || itemData.price === null || itemData.price < 0) {
      errors.push('Price must be a positive number')
    }
    
    if (itemData.item_name && itemData.item_name.length > 255) {
      errors.push('Item name must not exceed 255 characters')
    }
    
    if (itemData.description && itemData.description.length > 1000) {
      errors.push('Description must not exceed 1000 characters')
    }
    
    if (itemData.image_url && !this.isValidUrl(itemData.image_url)) {
      errors.push('Image URL must be a valid URL')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Check if URL is valid
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

// Create and export a singleton instance
const itemsService = new ItemsService()
export default itemsService

// Also export the class for testing purposes
export { ItemsService }
