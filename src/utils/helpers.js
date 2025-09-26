/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount 
 * @param {boolean} withSymbol 
 * @returns {string}
 */
export function formatCurrency(amount, withSymbol = true) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0
  }

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)

  return withSymbol ? formatted : formatted.replace('Rp', '').trim()
}

/**
 * Format number with thousand separators
 * @param {number} number 
 * @returns {string}
 */
export function formatNumber(number) {
  if (typeof number !== 'number') {
    number = parseFloat(number) || 0
  }
  
  return new Intl.NumberFormat('id-ID').format(number)
}

/**
 * Format date to Indonesian format
 * @param {string|Date} date 
 * @param {boolean} includeTime 
 * @returns {string}
 */
export function formatDate(date, includeTime = false) {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return '-'

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('id-ID', options).format(dateObj)
}

/**
 * Format time only
 * @param {string|Date} date 
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(dateObj)
}

/**
 * Format relative time (e.g., "2 jam yang lalu")
 * @param {string|Date} date 
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now - dateObj
  
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return 'Baru saja'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} menit yang lalu`
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`
  } else if (diffDays < 30) {
    return `${diffDays} hari yang lalu`
  } else {
    return formatDate(dateObj)
  }
}

/**
 * Debounce function
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clone object
 * @param {any} obj 
 * @returns {any}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const copy = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key])
    })
    return copy
  }
}

/**
 * Generate random ID
 * @param {number} length 
 * @returns {string}
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validate email
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone 
 * @returns {boolean}
 */
export function validatePhone(phone) {
  // Indonesian phone number format
  const re = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  return re.test(phone.replace(/\s|-/g, ''))
}

/**
 * Format file size
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension
 * @param {string} filename 
 * @returns {string}
 */
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * Check if file type is allowed
 * @param {string} filename 
 * @param {string[]} allowedTypes 
 * @returns {boolean}
 */
export function isFileTypeAllowed(filename, allowedTypes) {
  const extension = getFileExtension(filename).toLowerCase()
  return allowedTypes.map(type => type.toLowerCase()).includes(extension)
}

/**
 * Calculate percentage
 * @param {number} part 
 * @param {number} total 
 * @returns {number}
 */
export function calculatePercentage(part, total) {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

/**
 * Round to decimal places
 * @param {number} number 
 * @param {number} decimals 
 * @returns {number}
 */
export function roundToDecimals(number, decimals = 2) {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Capitalize first letter
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert to title case
 * @param {string} str 
 * @returns {string}
 */
export function toTitleCase(str) {
  if (!str) return ''
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Truncate text
 * @param {string} text 
 * @param {number} length 
 * @param {string} suffix 
 * @returns {string}
 */
export function truncateText(text, length = 50, suffix = '...') {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + suffix
}

/**
 * Get status color class
 * @param {string} status 
 * @returns {string}
 */
export function getStatusColor(status) {
  const statusColors = {
    'completed': 'success',
    'selesai': 'success',
    'pending': 'warning',
    'cancelled': 'danger',
    'dibatalkan': 'danger',
    'active': 'success',
    'aktif': 'success',
    'inactive': 'secondary',
    'nonaktif': 'secondary',
    'draft': 'info',
    'published': 'success',
    'unpublished': 'secondary'
  }

  return statusColors[status?.toLowerCase()] || 'secondary'
}

/**
 * Format transaction ID
 * @param {string|number} id 
 * @returns {string}
 */
export function formatTransactionId(id) {
  return `TRX${String(id).padStart(6, '0')}`
}

/**
 * Format product code
 * @param {string|number} id 
 * @returns {string}
 */
export function formatProductCode(id) {
  return `PRD${String(id).padStart(4, '0')}`
}

/**
 * Calculate discount
 * @param {number} originalPrice 
 * @param {number} discountPercent 
 * @returns {object}
 */
export function calculateDiscount(originalPrice, discountPercent) {
  const discountAmount = (originalPrice * discountPercent) / 100
  const finalPrice = originalPrice - discountAmount
  
  return {
    originalPrice,
    discountPercent,
    discountAmount,
    finalPrice
  }
}

/**
 * Calculate tax
 * @param {number} amount 
 * @param {number} taxPercent 
 * @returns {object}
 */
export function calculateTax(amount, taxPercent = 11) {
  const taxAmount = (amount * taxPercent) / 100
  const totalWithTax = amount + taxAmount
  
  return {
    amount,
    taxPercent,
    taxAmount,
    totalWithTax
  }
}

/**
 * Download file from URL
 * @param {string} url 
 * @param {string} filename 
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Copy text to clipboard
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  }
}

/**
 * Get current timestamp
 * @returns {string}
 */
export function getCurrentTimestamp() {
  return new Date().toISOString()
}

/**
 * Check if date is today
 * @param {string|Date} date 
 * @returns {boolean}
 */
export function isToday(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear()
}

/**
 * Get date range (start and end of day)
 * @param {string|Date} date 
 * @returns {object}
 */
export function getDayRange(date = new Date()) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const start = new Date(dateObj)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(dateObj)
  end.setHours(23, 59, 59, 999)
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  }
}
