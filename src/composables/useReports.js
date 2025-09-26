import { ref, computed } from 'vue'
import reportService from '../services/reportService'

const todayReport = ref(null)
const monthlyReport = ref(null)
const dailyReport = ref(null)
const loading = ref(false)
const error = ref(null)

export const useReports = () => {
  const loadTodayReport = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getTodayReport()
      if (response.success) {
        todayReport.value = response.data
      } else {
        error.value = response.error || 'Gagal memuat laporan hari ini'
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat laporan hari ini'
    } finally {
      loading.value = false
    }
  }

  const loadMonthlyReport = async (month, year) => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getMonthlyReport(month, year)
      if (response.success) {
        monthlyReport.value = response.data
      } else {
        error.value = response.error || 'Gagal memuat laporan bulanan'
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat laporan bulanan'
    } finally {
      loading.value = false
    }
  }

  const loadDateReport = async (date) => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getDateReport(date)
      if (response.success) {
        dailyReport.value = response.data
      } else {
        error.value = response.error || 'Gagal memuat laporan harian'
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat laporan harian'
    } finally {
      loading.value = false
    }
  }

  // Computed properties for statistics berdasarkan API spec
  const todayStats = computed(() => {
    if (!todayReport.value) return null
    
    return {
      totalTransactions: todayReport.value.total_transactions || 0,
      totalRevenue: todayReport.value.sum_total_price || 0,
      totalItemsSold: calculateTotalItemsSold(todayReport.value.transactions || []),
      date: todayReport.value.date
    }
  })

  const monthlyStats = computed(() => {
    if (!monthlyReport.value) return null
    
    return {
      totalTransactions: monthlyReport.value.total_transactions || 0,
      totalRevenue: monthlyReport.value.sum_total_price || 0,
      totalItemsSold: calculateTotalItemsSold(monthlyReport.value.transactions || []),
      month: monthlyReport.value.month,
      year: monthlyReport.value.year
    }
  })

  const dailyStats = computed(() => {
    if (!dailyReport.value) return null
    
    return {
      totalTransactions: dailyReport.value.total_transactions || 0,
      totalRevenue: dailyReport.value.sum_total_price || 0,
      totalItemsSold: calculateTotalItemsSold(dailyReport.value.transactions || []),
      date: dailyReport.value.date
    }
  })

  // Helper function untuk menghitung total items terjual
  const calculateTotalItemsSold = (transactions) => {
    if (!Array.isArray(transactions)) return 0
    
    return transactions.reduce((total, transaction) => {
      // Jika transaction memiliki items detail
      if (transaction.items && Array.isArray(transaction.items)) {
        const transactionItems = transaction.items.reduce((sum, item) => {
          return sum + (item.quantity || 0)
        }, 0)
        return total + transactionItems
      }
      
      // Fallback: asumsi 1 item per transaction jika tidak ada detail
      return total + 1
    }, 0)
  }

  // Additional computed properties
  const allReports = computed(() => ({
    today: todayReport.value,
    monthly: monthlyReport.value,
    daily: dailyReport.value
  }))

  const hasAnyData = computed(() => {
    return todayReport.value || monthlyReport.value || dailyReport.value
  })

  // Helper functions
  const clearReports = () => {
    todayReport.value = null
    monthlyReport.value = null
    dailyReport.value = null
    error.value = null
  }

  const refreshAllReports = async () => {
    await Promise.all([
      loadTodayReport(),
      // Add other refresh logic as needed
    ])
  }

  return {
    // Data
    todayReport,
    monthlyReport,
    dailyReport,
    loading,
    error,

    // Computed stats
    todayStats,
    monthlyStats,
    dailyStats,
    allReports,
    hasAnyData,

    // Methods
    loadTodayReport,
    loadMonthlyReport,
    loadDateReport,
    clearReports,
    refreshAllReports
  }
}

// Additional composable for report filtering
export const useReportFilters = () => {
  const filters = ref({
    dateRange: {
      start: null,
      end: null
    },
    period: 'today', // today, daily, monthly, yearly
    customDate: null,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const resetFilters = () => {
    filters.value = {
      dateRange: {
        start: null,
        end: null
      },
      period: 'today',
      customDate: null,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  }

  const setDateRange = (start, end) => {
    filters.value.dateRange.start = start
    filters.value.dateRange.end = end
  }

  const setPeriod = (period) => {
    filters.value.period = period
  }

  const setMonth = (month) => {
    filters.value.month = month
  }

  const setYear = (year) => {
    filters.value.year = year
  }

  const getFilterParams = () => {
    return {
      ...filters.value
    }
  }

  return {
    filters,
    resetFilters,
    setDateRange,
    setPeriod,
    setMonth,
    setYear,
    getFilterParams
  }
}
