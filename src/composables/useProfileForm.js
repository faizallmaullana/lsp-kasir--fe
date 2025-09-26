import { ref, reactive, computed } from 'vue'

/**
 * Profile Form Composable
 * Provides form validation and management for profile forms
 */
export function useProfileForm() {
  const formData = reactive({
    name: '',
    contact: '',
    address: '',
    image_url: ''
  })

  const errors = reactive({
    name: '',
    contact: '',
    address: '',
    image_url: ''
  })

  const isSubmitting = ref(false)

  // Validation rules
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
    if (!password || password.trim().length === 0) {
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

  const validateRole = (role) => {
    if (!role || role.trim().length === 0) {
      return 'Role harus dipilih'
    }
    if (!['ADMIN', 'STAFF'].includes(role)) {
      return 'Role harus ADMIN atau STAFF'
    }
    return ''
  }

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
    errors.name = validateName(formData.name)
    errors.contact = validateContact(formData.contact)
    errors.address = validateAddress(formData.address)
    errors.image_url = validateImageUrl(formData.image_url)

    return !Object.values(errors).some(error => error !== '')
  }

  // Reset form
  const resetForm = () => {
    formData.name = ''
    formData.contact = ''
    formData.address = ''
    formData.image_url = ''
    
    errors.name = ''
    errors.contact = ''
    errors.address = ''
    errors.image_url = ''
    
    isSubmitting.value = false
  }

  // Populate form with existing data
  const populateForm = (profileData) => {
    formData.name = profileData.name || ''
    formData.contact = profileData.contact || ''
    formData.address = profileData.address || ''
    formData.image_url = profileData.image_url || profileData.photo || ''
    
    // Clear errors
    errors.name = ''
    errors.contact = ''
    errors.address = ''
    errors.image_url = ''
  }

  // Get form data
  const getFormData = () => {
    return {
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      address: formData.address.trim(),
      image_url: formData.image_url.trim()
    }
  }

  // Check if form has changes
  const hasChanges = computed(() => {
    return formData.name !== '' || 
           formData.contact !== '' || 
           formData.address !== '' || 
           formData.image_url !== ''
  })

  // Check if form is valid
  const isValid = computed(() => {
    return validateName(formData.name) === '' &&
           validateContact(formData.contact) === '' &&
           validateAddress(formData.address) === '' &&
           validateImageUrl(formData.image_url) === ''
  })

  return {
    // Form state
    formData,
    errors,
    isSubmitting,
    
    // Computed
    hasChanges,
    isValid,
    
    // Methods
    validateForm,
    resetForm,
    populateForm,
    getFormData,
    
    // Individual validators
    validateName,
    validateContact,
    validateAddress,
    validateImageUrl
  }
}

/**
 * User Creation Form Composable
 * Provides form validation and management for creating users with profiles (Admin only)
 */
export function useUserForm() {
  const formData = reactive({
    email: '',
    password: '',
    role: 'cashier', // default role
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
    role: '',
    profile: {
      name: '',
      contact: '',
      address: '',
      image_url: ''
    }
  })

  const isSubmitting = ref(false)

  // Validation rules
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

  const validateRole = (role) => {
    const validRoles = ['admin', 'cashier']
    if (!validRoles.includes(role)) {
      return 'Role harus admin atau cashier'
    }
    return ''
  }

  const validateProfileName = (name) => {
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

  const validateProfileContact = (contact) => {
    if (!contact || contact.trim().length === 0) {
      return 'Kontak harus diisi'
    }
    if (contact.length > 20) {
      return 'Kontak maksimal 20 karakter'
    }
    return ''
  }

  const validateProfileAddress = (address) => {
    if (!address || address.trim().length === 0) {
      return 'Alamat harus diisi'
    }
    if (address.length > 500) {
      return 'Alamat maksimal 500 karakter'
    }
    return ''
  }

  const validateProfileImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.length > 255) {
      return 'URL gambar maksimal 255 karakter'
    }
    return ''
  }

  // Validate all fields
  const validateForm = () => {
    errors.email = validateEmail(formData.email)
    errors.password = validatePassword(formData.password)
    errors.role = validateRole(formData.role)
    errors.profile.name = validateProfileName(formData.profile.name)
    errors.profile.contact = validateProfileContact(formData.profile.contact)
    errors.profile.address = validateProfileAddress(formData.profile.address)
    errors.profile.image_url = validateProfileImageUrl(formData.profile.image_url)

    return !errors.email && 
           !errors.password && 
           !errors.role && 
           !errors.profile.name && 
           !errors.profile.contact && 
           !errors.profile.address && 
           !errors.profile.image_url
  }

  // Reset form
  const resetForm = () => {
    formData.email = ''
    formData.password = ''
    formData.role = 'cashier'
    formData.profile.name = ''
    formData.profile.contact = ''
    formData.profile.address = ''
    formData.profile.image_url = ''
    
    errors.email = ''
    errors.password = ''
    errors.role = ''
    errors.profile.name = ''
    errors.profile.contact = ''
    errors.profile.address = ''
    errors.profile.image_url = ''
    
    isSubmitting.value = false
  }

  // Get form data
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
           validateRole(formData.role) === '' &&
           validateProfileName(formData.profile.name) === '' &&
           validateProfileContact(formData.profile.contact) === '' &&
           validateProfileAddress(formData.profile.address) === '' &&
           validateProfileImageUrl(formData.profile.image_url) === ''
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
    validateRole,
    validateProfileName,
    validateProfileContact,
    validateProfileAddress,
    validateProfileImageUrl
  }
}
