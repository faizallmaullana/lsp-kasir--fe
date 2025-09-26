import { ref, reactive, computed } from 'vue'

/**
 * Email Form Composable
 * Provides form validation and management for email update forms
 */
export function useEmailForm() {
  const formData = reactive({
    email: ''
  })

  const errors = reactive({
    email: ''
  })

  const isSubmitting = ref(false)

  // Email validation
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

  // Validate form
  const validateForm = () => {
    errors.email = validateEmail(formData.email)
    return errors.email === ''
  }

  // Reset form
  const resetForm = () => {
    formData.email = ''
    errors.email = ''
    isSubmitting.value = false
  }

  // Populate form
  const populateForm = (email) => {
    formData.email = email || ''
    errors.email = ''
  }

  // Get form data
  const getFormData = () => {
    return formData.email.trim()
  }

  // Check if form is valid
  const isValid = computed(() => {
    return validateEmail(formData.email) === ''
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
    populateForm,
    getFormData,
    validateEmail
  }
}
