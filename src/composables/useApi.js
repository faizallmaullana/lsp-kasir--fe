import { ref, reactive } from 'vue'
import { api } from '../config/axios.js'

/**
 * Composable untuk menangani API calls dengan loading state dan error handling
 */
export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const execute = async (apiCall) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall()
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err
      console.error('API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}

/**
 * Composable untuk pagination
 */
export function usePagination(initialPage = 1, initialSize = 10) {
  const pagination = reactive({
    page: initialPage,
    size: initialSize,
    total: 0,
    totalPages: 0
  })

  const setPage = (page) => {
    pagination.page = Math.max(1, Math.min(page, pagination.totalPages))
  }

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      pagination.page++
    }
  }

  const prevPage = () => {
    if (pagination.page > 1) {
      pagination.page--
    }
  }

  const setTotal = (total) => {
    pagination.total = total
    pagination.totalPages = Math.ceil(total / pagination.size)
  }

  const getOffset = () => {
    return (pagination.page - 1) * pagination.size
  }

  const reset = () => {
    pagination.page = initialPage
    pagination.total = 0
    pagination.totalPages = 0
  }

  return {
    pagination,
    setPage,
    nextPage,
    prevPage,
    setTotal,
    getOffset,
    reset
  }
}

/**
 * Composable untuk filter dan search
 */
export function useFilter() {
  const filters = ref({})
  const search = ref('')
  const sortBy = ref('')
  const sortOrder = ref('asc')

  const setFilter = (key, value) => {
    if (value === null || value === undefined || value === '') {
      delete filters.value[key]
    } else {
      filters.value[key] = value
    }
  }

  const clearFilters = () => {
    filters.value = {}
    search.value = ''
  }

  const getParams = () => {
    const params = { ...filters.value }
    
    if (search.value) {
      params.search = search.value
    }
    
    if (sortBy.value) {
      params.sort_by = sortBy.value
      params.sort_order = sortOrder.value
    }
    
    return params
  }

  const toggleSort = (field) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  return {
    filters,
    search,
    sortBy,
    sortOrder,
    setFilter,
    clearFilters,
    getParams,
    toggleSort
  }
}

/**
 * Composable untuk menangani form dengan validation
 */
export function useForm(initialData = {}, validationRules = {}) {
  const formData = ref({ ...initialData })
  const errors = ref({})
  const touched = ref({})
  const isValid = ref(true)

  const setFieldValue = (field, value) => {
    formData.value[field] = value
    touched.value[field] = true
    validateField(field)
  }

  const validateField = (field) => {
    const value = formData.value[field]
    const rules = validationRules[field]

    if (!rules) {
      delete errors.value[field]
      return true
    }

    const fieldErrors = []

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(`${field} wajib diisi`)
    }

    // Min length validation
    if (rules.minLength && value && value.toString().length < rules.minLength) {
      fieldErrors.push(`${field} minimal ${rules.minLength} karakter`)
    }

    // Max length validation
    if (rules.maxLength && value && value.toString().length > rules.maxLength) {
      fieldErrors.push(`${field} maksimal ${rules.maxLength} karakter`)
    }

    // Email validation
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      fieldErrors.push(`${field} harus berformat email yang valid`)
    }

    // Number validation
    if (rules.number && value && isNaN(Number(value))) {
      fieldErrors.push(`${field} harus berupa angka`)
    }

    // Min value validation
    if (rules.min && value && Number(value) < rules.min) {
      fieldErrors.push(`${field} minimal ${rules.min}`)
    }

    // Max value validation
    if (rules.max && value && Number(value) > rules.max) {
      fieldErrors.push(`${field} maksimal ${rules.max}`)
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, formData.value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors
    } else {
      delete errors.value[field]
    }

    updateValidationStatus()
    return fieldErrors.length === 0
  }

  const validateAll = () => {
    Object.keys(formData.value).forEach(field => {
      touched.value[field] = true
      validateField(field)
    })
    return isValid.value
  }

  const updateValidationStatus = () => {
    isValid.value = Object.keys(errors.value).length === 0
  }

  const reset = () => {
    formData.value = { ...initialData }
    errors.value = {}
    touched.value = {}
    isValid.value = true
  }

  const getFieldError = (field) => {
    return errors.value[field] ? errors.value[field][0] : ''
  }

  const hasFieldError = (field) => {
    return !!(errors.value[field] && errors.value[field].length > 0)
  }

  return {
    formData,
    errors,
    touched,
    isValid,
    setFieldValue,
    validateField,
    validateAll,
    reset,
    getFieldError,
    hasFieldError
  }
}

/**
 * Composable untuk menangani modal
 */
export function useModal() {
  const isOpen = ref(false)
  const data = ref(null)

  const open = (modalData = null) => {
    data.value = modalData
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    data.value = null
  }

  const toggle = () => {
    isOpen.value ? close() : open()
  }

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  }
}

/**
 * Composable untuk notifikasi/toast
 */
export function useNotification() {
  const notifications = ref([])
  let nextId = 1

  const show = (message, type = 'info', duration = 5000) => {
    const notification = {
      id: nextId++,
      message,
      type,
      timestamp: Date.now()
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        remove(notification.id)
      }, duration)
    }

    return notification.id
  }

  const success = (message, duration = 5000) => {
    return show(message, 'success', duration)
  }

  const error = (message, duration = 7000) => {
    return show(message, 'error', duration)
  }

  const warning = (message, duration = 6000) => {
    return show(message, 'warning', duration)
  }

  const info = (message, duration = 5000) => {
    return show(message, 'info', duration)
  }

  const remove = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}

/**
 * Composable untuk loading state global
 */
export function useLoading() {
  const isLoading = ref(false)
  const loadingMessage = ref('')
  
  const startLoading = (message = 'Loading...') => {
    isLoading.value = true
    loadingMessage.value = message
  }

  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading
  }
}
