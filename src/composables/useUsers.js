import { ref, computed, reactive } from 'vue'
import profileService from '../services/profileService.js'

const users = ref([])
const loading = ref(false)
const error = ref(null)

export const useUsers = () => {
  const loadUsers = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await usersService.getAll(params)
      if (response.success) {
        users.value = response.data || []
      } else {
        error.value = response.error || 'Gagal memuat data users'
      }
      return response
    } catch (err) {
      error.value = err.message || 'Gagal memuat data users'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    error.value = null
    try {
      console.log('useUsers createUser called with:', userData)
      
      const response = await usersService.create(userData)
      console.log('useUsers service response:', response)
      
      if (response.success) {
        // Add to local users array
        const newUser = response.data
        users.value.unshift(newUser)
        return true
      } else {
        error.value = response.error || 'Gagal menambah user'
        console.error('Create user failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal menambah user'
      console.error('Create user error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await usersService.update(id, userData)
      
      if (response.success) {
        // Update local users array
        const index = users.value.findIndex(u => u.id_user === id || u.id === id)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...response.data }
        }
        return true
      } else {
        error.value = response.error || 'Gagal mengupdate user'
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengupdate user'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await usersService.delete(id)
      
      if (response.success) {
        // Remove from local users array
        users.value = users.value.filter(u => (u.id_user || u.id) !== id)
        return true
      } else {
        error.value = response.error || 'Gagal menghapus user'
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal menghapus user'
      return false
    } finally {
      loading.value = false
    }
  }

  const toggleUserStatus = async (id, isActive) => {
    const loadingUserId = ref(null)
    loadingUserId.value = id
    error.value = null
    
    try {
      const response = await usersService.toggleStatus(id, isActive)
      
      if (response.success) {
        // Update local users array
        const index = users.value.findIndex(u => (u.id_user || u.id) === id)
        if (index !== -1) {
          users.value[index].is_active = isActive
        }
        return true
      } else {
        error.value = response.error || 'Gagal mengubah status user'
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengubah status user'
      return false
    } finally {
      loadingUserId.value = null
    }
  }

  const changePassword = async (id, passwordData) => {
    loading.value = true
    error.value = null
    try {
      const response = await usersService.changePassword(id, passwordData)
      
      if (response.success) {
        return true
      } else {
        error.value = response.error || 'Gagal mengubah password'
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengubah password'
      return false
    } finally {
      loading.value = false
    }
  }

  const searchUsers = async (query, params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await usersService.search(query, params)
      if (response.success) {
        users.value = response.data || []
      } else {
        error.value = response.error || 'Gagal mencari users'
      }
    } catch (err) {
      error.value = err.message || 'Gagal mencari users'
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await usersService.getById(id)
      
      if (response.success) {
        return response.data
      } else {
        error.value = response.error || 'Gagal memuat detail user'
        return null
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat detail user'
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Computed properties
  const activeUsers = computed(() => {
    return users.value.filter(user => user.is_active !== false)
  })

  const inactiveUsers = computed(() => {
    return users.value.filter(user => user.is_active === false)
  })

  const usersByRole = computed(() => {
    const roles = {}
    users.value.forEach(user => {
      const role = user.role || 'user'
      if (!roles[role]) {
        roles[role] = []
      }
      roles[role].push(user)
    })
    return roles
  })

  const userRoles = computed(() => {
    const roles = [...new Set(users.value.map(user => user.role || 'user'))]
    return roles.sort()
  })

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changePassword,
    searchUsers,
    getUserById,
    clearError,
    activeUsers,
    inactiveUsers,
    usersByRole,
    userRoles
  }
}

// Form composable for user management
export const useUserForm = () => {
  const form = ref({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    full_name: '',
    phone: '',
    role: 'cashier',
    is_active: true
  })

  const formErrors = ref({})
  const isLoading = ref(false)

  const resetForm = () => {
    form.value = {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      full_name: '',
      phone: '',
      role: 'cashier',
      is_active: true
    }
    formErrors.value = {}
  }

  const validateForm = (isEdit = false) => {
    const errors = {}
    
    // Username validation
    if (!form.value.username?.trim()) {
      errors.username = ['Username wajib diisi']
    } else if (form.value.username.length < 3) {
      errors.username = ['Username minimal 3 karakter']
    }
    
    // Email validation
    if (!form.value.email?.trim()) {
      errors.email = ['Email wajib diisi']
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.value.email)) {
        errors.email = ['Format email tidak valid']
      }
    }
    
    // Password validation (only for create or when changing password)
    if (!isEdit) {
      if (!form.value.password?.trim()) {
        errors.password = ['Password wajib diisi']
      } else if (form.value.password.length < 6) {
        errors.password = ['Password minimal 6 karakter']
      }
      
      // Confirm password
      if (form.value.password !== form.value.confirm_password) {
        errors.confirm_password = ['Konfirmasi password tidak sama']
      }
    }
    
    // Full name validation
    if (form.value.full_name && form.value.full_name.length < 2) {
      errors.full_name = ['Nama lengkap minimal 2 karakter']
    }
    
    // Phone validation
    if (form.value.phone && form.value.phone.length < 10) {
      errors.phone = ['Nomor telepon minimal 10 digit']
    }
    
    // Role validation
    if (!form.value.role) {
      errors.role = ['Role wajib dipilih']
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const setFormData = (userData) => {
    form.value = {
      username: userData.username || '',
      email: userData.email || '',
      password: '', // Don't populate password for edit
      confirm_password: '',
      full_name: userData.full_name || '',
      phone: userData.phone || '',
      role: userData.role || 'cashier',
      is_active: userData.is_active !== false
    }
    formErrors.value = {}
  }

  const getFormData = (isEdit = false) => {
    const data = {
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      full_name: form.value.full_name?.trim() || null,
      phone: form.value.phone?.trim() || null,
      role: form.value.role,
      is_active: form.value.is_active
    }
    
    // Only include password for create or when specifically changing password
    if (!isEdit && form.value.password) {
      data.password = form.value.password
    }
    
    return data
  }

  const getFieldError = (field) => {
    return formErrors.value[field] ? formErrors.value[field][0] : ''
  }

  const hasFieldError = (field) => {
    return !!(formErrors.value[field] && formErrors.value[field].length > 0)
  }

  return {
    form,
    formErrors,
    isLoading,
    resetForm,
    validateForm,
    setFormData,
    getFormData,
    getFieldError,
    hasFieldError
  }
}
