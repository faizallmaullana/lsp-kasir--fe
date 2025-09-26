import { api as apiClient } from '../config/axios.js'

/**
 * Report Service
 * Provides methods for generating various reports
 */
class ReportService {
  /**
   * Get today's report
   * @returns {Promise<Object>} Today's report data
   */
  async getTodayReport() {
    try {
      const response = await apiClient.get('/reports/today')
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch today report',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (today report):', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Get monthly report
   * @param {number} month - Month (1-12)
   * @param {number} year - Year (e.g., 2025)
   * @returns {Promise<Object>} Monthly report data
   */
  async getMonthlyReport(month, year) {
    try {
      if (!month || !year) {
        return {
          success: false,
          error: 'Month and year are required',
          status: 'BAD_REQUEST'
        }
      }

      if (month < 1 || month > 12) {
        return {
          success: false,
          error: 'Month must be between 1 and 12',
          status: 'BAD_REQUEST'
        }
      }

      // Sesuai API spec: /api/reports/:bulan/:tahun
      const response = await apiClient.get(`/reports/${month}/${year}`)
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.MESSAGE || 'Failed to fetch monthly report',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (monthly report):', error.message)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.MESSAGE || 'Invalid month/year',
              status: 'BAD_REQUEST'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to query transactions',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to get monthly report',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Get report for specific date
   * @param {string} date - Date in format YYYY-MM-DD
   * @returns {Promise<Object>} Daily report data
   */
  async getDateReport(date) {
    try {
      if (!date) {
        return {
          success: false,
          error: 'Date is required',
          status: 'BAD_REQUEST'
        }
      }

      // Convert YYYY-MM-DD to dd/mm/yyyy format for API
      let dd, mm, yyyy
      if (date.includes('-')) {
        const parts = date.split('-')
        yyyy = parts[0]
        mm = parts[1]
        dd = parts[2]
      } else {
        return {
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD',
          status: 'BAD_REQUEST'
        }
      }

      // Validate date components
      const dayNum = parseInt(dd)
      const monthNum = parseInt(mm)
      const yearNum = parseInt(yyyy)

      if (dayNum < 1 || dayNum > 31) {
        return {
          success: false,
          error: 'Day must be between 1 and 31',
          status: 'BAD_REQUEST'
        }
      }

      if (monthNum < 1 || monthNum > 12) {
        return {
          success: false,
          error: 'Month must be between 1 and 12',
          status: 'BAD_REQUEST'
        }
      }

      if (yearNum < 1970) {
        return {
          success: false,
          error: 'Year must be >= 1970',
          status: 'BAD_REQUEST'
        }
      }

      // Sesuai API spec: /api/reports/date/:dd/:mm/:yyyy
      const response = await apiClient.get(`/reports/date/${dd}/${mm}/${yyyy}`)
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.MESSAGE || 'Failed to fetch date report',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (date report):', error.message)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data.MESSAGE || 'Invalid dd/mm/yyyy',
              status: 'BAD_REQUEST'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to query transactions',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to get date report',
              status: 'UNKNOWN_ERROR'
            }
        }
      }
      
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Get yearly report
   * @param {string|number} year - Year in format YYYY
   * @returns {Promise<Object>} Yearly report data
   */
  async getYearlyReport(year) {
    try {
      if (!year) {
        return {
          success: false,
          error: 'Year is required',
          status: 'BAD_REQUEST'
        }
      }

      const params = { year: String(year) }
      const response = await apiClient.get('/reports/yearly', { params })
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch yearly report',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (yearly report):', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Get report for date range
   * @param {string} startDate - Start date in format YYYY-MM-DD
   * @param {string} endDate - End date in format YYYY-MM-DD
   * @returns {Promise<Object>} Date range report data
   */
  async getDateRangeReport(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        return {
          success: false,
          error: 'Start date and end date are required',
          status: 'BAD_REQUEST'
        }
      }

      const params = { 
        start_date: startDate, 
        end_date: endDate 
      }
      
      const response = await apiClient.get('/reports/range', { params })
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch date range report',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (date range report):', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Get sales summary report
   * @param {Object} params - Query parameters
   * @param {string} params.period - Period type (daily, weekly, monthly, yearly)
   * @param {string} params.date - Specific date or start date
   * @param {string} params.end_date - End date for range
   * @returns {Promise<Object>} Sales summary data
   */
  async getSalesSummary(params = {}) {
    try {
      const response = await apiClient.get('/reports/sales-summary', { params })
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch sales summary',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (sales summary):', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Get top selling items report
   * @param {Object} params - Query parameters
   * @param {string} params.period - Period type
   * @param {number} params.limit - Number of items to return
   * @returns {Promise<Object>} Top selling items data
   */
  async getTopSellingItems(params = {}) {
    try {
      const queryParams = {
        limit: 10,
        ...params
      }
      
      const response = await apiClient.get('/reports/top-items', { params: queryParams })
      
      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to fetch top selling items',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Backend API error (top selling items):', error.message)
      return {
        success: false,
        error: 'Cannot connect to backend API: ' + error.message,
        data: null
      }
    }
  }

  /**
   * Export report data as CSV
   * @param {string} reportType - Type of report (today, monthly, yearly, etc.)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} CSV export response
   */
  async exportToCSV(reportType, params = {}) {
    try {
      const response = await apiClient.get(`/reports/export/${reportType}`, { 
        params,
        responseType: 'blob' 
      })
      
      return {
        success: true,
        data: response.data,
        filename: response.headers['content-disposition']?.split('filename=')[1] || `${reportType}-report.csv`
      }
    } catch (error) {
      console.error('Backend API error (export CSV):', error.message)
      return {
        success: false,
        error: 'Cannot export report: ' + error.message
      }
    }
  }

  /**
   * Validate date format
   * @param {string} date - Date string to validate
   * @returns {boolean} True if valid YYYY-MM-DD format
   */
  isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) return false
    
    const parsedDate = new Date(date)
    return parsedDate instanceof Date && !isNaN(parsedDate)
  }

  /**
   * Validate month format
   * @param {string} month - Month string to validate
   * @returns {boolean} True if valid MM format (01-12)
   */
  isValidMonth(month) {
    const monthRegex = /^\d{2}$/
    if (!monthRegex.test(month)) return false
    
    const monthNum = parseInt(month, 10)
    return monthNum >= 1 && monthNum <= 12
  }

  /**
   * Validate year format
   * @param {string|number} year - Year to validate
   * @returns {boolean} True if valid year
   */
  isValidYear(year) {
    const yearNum = parseInt(year, 10)
    const currentYear = new Date().getFullYear()
    return yearNum >= 2020 && yearNum <= currentYear + 1
  }

  /**
   * Format date for API
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string YYYY-MM-DD
   */
  formatDate(date) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return String(date)
  }

  /**
   * Get current month and year
   * @returns {Object} Current month and year
   */
  getCurrentPeriod() {
    const now = new Date()
    return {
      month: String(now.getMonth() + 1).padStart(2, '0'),
      year: now.getFullYear(),
      date: this.formatDate(now)
    }
  }
}

// Create and export a singleton instance
const reportService = new ReportService()
export default reportService

// Also export the class for testing purposes
export { ReportService }
