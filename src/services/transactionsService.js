import { api as apiClient } from '../config/axios.js'

/**
 * Transactions Service
 * Provides methods for CRUD operations on transactions
 */
class TransactionsService {
  /**
   * Get all transactions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/transactions', { params })
      
      if (response.data.STATUS === 'OK') {
        const transactions = Array.isArray(response.data.DATA) ? response.data.DATA : []
        
        return {
          success: true,
          data: transactions,
          pagination: response.data.pagination || {
            page: 1,
            count: transactions.length,
            total: transactions.length,
            hasMore: false
          },
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch transactions',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error:', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: []
      }
    }
  }

  /**
   * Get all transactions with items details
   * Menggunakan endpoint standar /transactions dan kemudian fetch detail per transaction
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response with items
   */
  async getAllWithItems(params = {}) {
    try {
      // Ambil list transactions dulu
      const response = await apiClient.get('/transactions', { params })
      
      if (response.data.STATUS === 'OK') {
        const transactions = Array.isArray(response.data.DATA) ? response.data.DATA : []
        
        // Untuk setiap transaction, ambil detail items jika diperlukan
        const transactionsWithItems = await Promise.all(
          transactions.map(async (transaction) => {
            try {
              const detailResponse = await this.getById(transaction.id_transaction)
              if (detailResponse.success && detailResponse.data.items) {
                return {
                  ...transaction,
                  items: detailResponse.data.items
                }
              }
              return transaction
            } catch (error) {
              console.error(`Failed to fetch items for transaction ${transaction.id_transaction}:`, error)
              return transaction
            }
          })
        )
        
        return {
          success: true,
          data: transactionsWithItems,
          pagination: response.data.pagination || {
            page: 1,
            count: transactionsWithItems.length,
            total: transactionsWithItems.length,
            hasMore: false
          },
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch transactions',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error:', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: []
      }
    }
  }

  /**
   * Get transaction by ID
   * @param {string} id - Transaction UUID
   * @returns {Promise<Object>} Transaction details response
   */
  async getById(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Transaction ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.get(`/transactions/${id}`)
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.MESSAGE || 'Transaction not found',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Get transaction by ID error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 404:
            return {
              success: false,
              error: data.MESSAGE || 'Transaction not found',
              status: 'NOT_FOUND'
            }
          default:
            return {
              success: false,
              error: 'Failed to fetch transaction',
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
   * Create new transaction
   * @param {Object} transactionData - Transaction data
   * @param {Array} transactionData.items - Array of items with id_item, quantity
   * @param {string} transactionData.buyer_contact - Buyer contact (optional)
   * @returns {Promise<Object>} Create transaction response
   */
  async create(transactionData) {
    try {
      // Validate required fields sesuai API spec
      if (!transactionData.items || !Array.isArray(transactionData.items) || transactionData.items.length === 0) {
        return {
          success: false,
          error: 'Items are required and must be an array',
          status: 'BAD_REQUEST'
        }
      }

      // Validate items format sesuai API spec
      for (const item of transactionData.items) {
        if (!item.id_item) {
          return {
            success: false,
            error: 'Each item must have id_item',
            status: 'BAD_REQUEST'
          }
        }
        if (!item.quantity || item.quantity < 1) {
          return {
            success: false,
            error: 'Each item must have quantity >= 1',
            status: 'BAD_REQUEST'
          }
        }
      }

      // Format data sesuai API spec - server akan hitung total_price
      const data = {
        buyer_contact: transactionData.buyer_contact || '',
        items: transactionData.items.map(item => ({
          id_item: item.id_item,
          quantity: item.quantity
        }))
      }

      const response = await apiClient.post('/transactions', data)
      
      if (response.data.STATUS === 'created') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to create transaction',
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
              error: data.ERROR || 'Invalid transaction data',
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
              error: data.ERROR || 'Failed to create transaction on backend',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to create transaction on backend',
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
   * Update existing transaction
   * @param {string} id - Transaction UUID
   * @param {Object} transactionData - Updated transaction data
   * @returns {Promise<Object>} Update transaction response
   */
  async update(id, transactionData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Transaction ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.put(`/transactions/${id}`, transactionData)
      
      if (response.data.STATUS === 'updated') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || response.data.MESSAGE || 'Failed to update transaction',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Update transaction error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.ERROR || 'Invalid transaction data',
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
              error: data.MESSAGE || 'Transaction not found',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to update transaction',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to update transaction',
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
   * Delete transaction
   * @param {string} id - Transaction UUID
   * @returns {Promise<Object>} Delete transaction response
   */
  async delete(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Transaction ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.delete(`/transactions/${id}`)
      
      if (response.data.STATUS === 'deleted') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to delete transaction',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Delete transaction error:', error)
      
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
              error: 'Transaction not found',
              status: 'NOT_FOUND'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to delete transaction',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to delete transaction',
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
   * Search transactions by customer name or date range
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
      console.error('Search transactions error:', error)
      return {
        success: false,
        error: 'Failed to search transactions',
        status: 'SEARCH_ERROR'
      }
    }
  }

  /**
   * Get transactions by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Filtered transactions
   */
  async getByDateRange(startDate, endDate, params = {}) {
    try {
      const filterParams = {
        start_date: startDate,
        end_date: endDate,
        ...params
      }
      
      return await this.getAll(filterParams)
    } catch (error) {
      console.error('Get transactions by date range error:', error)
      return {
        success: false,
        error: 'Failed to filter transactions by date range',
        status: 'FILTER_ERROR'
      }
    }
  }

  /**
   * Get today's transactions
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Today's transactions
   */
  async getTodayTransactions(params = {}) {
    try {
      const today = new Date().toISOString().split('T')[0]
      return await this.getByDateRange(today, today, params)
    } catch (error) {
      console.error('Get today transactions error:', error)
      return {
        success: false,
        error: 'Failed to get today transactions',
        status: 'FILTER_ERROR'
      }
    }
  }

  /**
   * Validate transaction data
   * @param {Object} transactionData - Transaction data to validate
   * @returns {Object} Validation result
   */
  validateTransactionData(transactionData) {
    const errors = []
    
    if (!transactionData.items || !Array.isArray(transactionData.items) || transactionData.items.length === 0) {
      errors.push('Items are required and must be a non-empty array')
    } else {
      transactionData.items.forEach((item, index) => {
        if (!item.item_id) {
          errors.push(`Item ${index + 1}: item_id is required`)
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: quantity must be greater than 0`)
        }
        if (!item.price || item.price <= 0) {
          errors.push(`Item ${index + 1}: price must be greater than 0`)
        }
      })
    }
    
    if (!transactionData.total || transactionData.total <= 0) {
      errors.push('Total must be greater than 0')
    }
    
    if (transactionData.customer_name && transactionData.customer_name.length > 255) {
      errors.push('Customer name must not exceed 255 characters')
    }
    
    if (transactionData.notes && transactionData.notes.length > 1000) {
      errors.push('Notes must not exceed 1000 characters')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Create and export a singleton instance
const transactionsService = new TransactionsService()
export default transactionsService

// Also export the class for testing purposes
export { TransactionsService }
