import { ref, reactive, computed } from 'vue'

/**
 * User Form Composable
 * Provides form validation and management for user creation forms
 */
export function useUserForm() {
  const formData = reactive({
    // User data
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff', // default to staff
    
    // Profile data
    profile: {
      name: '',
      contact: '',
      address: '',
      image_url: ''
    }
  })

  const errors = reactive({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    profile: {
      name: '',
      contact: '',
      address: '',
      image_url: ''
    }
  })

  const isSubmitting = ref(false)

  // Validation rules for user
  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return 'Email harus diisi'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Format email tidak valid'
    }
    
    if (email.length > 100) {
      return 'Email maksimal 100 karakter'
    }
    
    return ''
  }

  const validatePassword = (password) => {
    if (!password || password.length === 0) {
      return 'Password harus diisi'
    }
    if (password.length < 6) {
      return 'Password minimal 6 karakter'
    }
    if (password.length > 50) {
      return 'Password maksimal 50 karakter'
    }
    return ''
  }

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword || confirmPassword.length === 0) {
      return 'Konfirmasi password harus diisi'
    }
    if (confirmPassword !== password) {
      return 'Konfirmasi password tidak cocok'
    }
    return ''
  }

  const validateRole = (role) => {
    if (!role || role.trim().length === 0) {
      return 'Role harus dipilih'
    }
    if (!['admin', 'staff'].includes(role)) {
      return 'Role tidak valid'
    }
    return ''
  }

  // Validation rules for profile
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Nama harus diisi'
    }
    if (name.trim().length < 2) {
      return 'Nama minimal 2 karakter'
    }
    if (name.length > 100) {
      return 'Nama maksimal 100 karakter'
    }
    return ''
  }

  const validateContact = (contact) => {
    if (!contact || contact.trim().length === 0) {
      return 'Kontak harus diisi'
    }
    if (contact.length > 20) {
      return 'Kontak maksimal 20 karakter'
    }
    return ''
  }

  const validateAddress = (address) => {
    if (!address || address.trim().length === 0) {
      return 'Alamat harus diisi'
    }
    if (address.length > 500) {
      return 'Alamat maksimal 500 karakter'
    }
    return ''
  }

  const validateImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.length > 255) {
      return 'URL gambar maksimal 255 karakter'
    }
    return ''
  }

  // Validate all fields
  const validateForm = () => {
    // Validate user fields
    errors.email = validateEmail(formData.email)
    errors.password = validatePassword(formData.password)
    errors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password)
    errors.role = validateRole(formData.role)

    // Validate profile fields
    errors.profile.name = validateName(formData.profile.name)
    errors.profile.contact = validateContact(formData.profile.contact)
    errors.profile.address = validateAddress(formData.profile.address)
    errors.profile.image_url = validateImageUrl(formData.profile.image_url)

    // Check if there are any errors
    const hasUserErrors = Object.values(errors).some(error => {
      if (typeof error === 'string') {
        return error !== ''
      } else if (typeof error === 'object') {
        return Object.values(error).some(subError => subError !== '')
      }
      return false
    })

    return !hasUserErrors
  }

  // Reset form
  const resetForm = () => {
    formData.email = ''
    formData.password = ''
    formData.confirmPassword = ''
    formData.role = 'staff'
    
    formData.profile.name = ''
    formData.profile.contact = ''
    formData.profile.address = ''
    formData.profile.image_url = ''
    
    // Reset errors
    errors.email = ''
    errors.password = ''
    errors.confirmPassword = ''
    errors.role = ''
    
    errors.profile.name = ''
    errors.profile.contact = ''
    errors.profile.address = ''
    errors.profile.image_url = ''
    
    isSubmitting.value = false
  }

  // Get form data in the format expected by API
  const getFormData = () => {
    return {
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      profile: {
        name: formData.profile.name.trim(),
        contact: formData.profile.contact.trim(),
        address: formData.profile.address.trim(),
        image_url: formData.profile.image_url.trim()
      }
    }
  }

  // Check if form is valid
  const isValid = computed(() => {
    return validateEmail(formData.email) === '' &&
           validatePassword(formData.password) === '' &&
           validateConfirmPassword(formData.confirmPassword, formData.password) === '' &&
           validateRole(formData.role) === '' &&
           validateName(formData.profile.name) === '' &&
           validateContact(formData.profile.contact) === '' &&
           validateAddress(formData.profile.address) === '' &&
           validateImageUrl(formData.profile.image_url) === ''
  })

  return {
    // Form state
    formData,
    errors,
    isSubmitting,
    
    // Computed
    isValid,
    
    // Methods
    validateForm,
    resetForm,
    getFormData,
    
    // Individual validators
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateRole,
    validateName,
    validateContact,
    validateAddress,
    validateImageUrl
  }
}
