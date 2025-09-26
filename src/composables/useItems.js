import { ref, computed } from 'vue'
import itemsService from '../services/itemsService'
import { fileToBase64, validateImageFile } from '../utils/imageUtils'

const items = ref([])
const loading = ref(false)
const error = ref(null)

export const useItems = () => {
  const loadItems = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await itemsService.getAll()
      if (response.success) {
        items.value = response.data || []
      } else {
        error.value = response.error || 'Gagal memuat data items'
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat data items'
    } finally {
      loading.value = false
    }
  }

  const createItem = async (itemData) => {
    loading.value = true
    error.value = null
    try {
      console.log('useItems createItem called with:', itemData)
      
      // Data already in API format from form
      const response = await itemsService.create(itemData)
      
      console.log('createItem service response:', response)
      
      if (response.success) {
        // Add to local items array with proper ID mapping
        const newItem = {
          ...response.data,
          id: response.data.id_item,
          name: response.data.item_name
        }
        items.value.unshift(newItem)
        return true
      } else {
        error.value = response.error || 'Gagal menambah item'
        console.error('Create item failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal menambah item'
      console.error('Create item error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id, itemData) => {
    loading.value = true
    error.value = null
    try {
      // Convert form data to API format
      const apiData = {
        item_name: itemData.name,
        price: itemData.price,
        item_type: itemData.item_type,
        is_available: itemData.is_available,
        description: itemData.description
      }
      
      const response = await itemsService.update(id, apiData)
      if (response.success) {
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value[index] = response.data
        }
        return response.data
      } else {
        error.value = response.error || 'Gagal mengupdate item'
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengupdate item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await itemsService.delete(id)
      if (response.success) {
        items.value = items.value.filter(item => item.id !== id)
      } else {
        error.value = response.error || 'Gagal menghapus item'
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Gagal menghapus item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateItemAvailability = async (id, isAvailable) => {
    loading.value = true
    error.value = null
    try {
      console.log(`Updating item ${id} availability to ${isAvailable}`)
      
      const response = await itemsService.updateAvailability(id, isAvailable)
      
      console.log('Update availability response:', response)
      
      if (response.success) {
        // Update local items array
        const index = items.value.findIndex(item => 
          (item.id_item || item.id) === id
        )
        
        if (index !== -1) {
          // Update with new data from API and maintain compatibility
          items.value[index] = {
            ...response.data,
            id: response.data.id_item,
            name: response.data.item_name
          }
        }
        
        return true
      } else {
        error.value = response.error || 'Gagal mengubah status item'
        console.error('Update availability failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengubah status item'
      console.error('Update availability error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Alias untuk backward compatibility
  const toggleItemStatus = updateItemAvailability

  // Computed properties
  const availableItems = computed(() => {
    return items.value.filter(item => item.is_available)
  })

  const itemsByType = computed(() => {
    const grouped = {}
    items.value.forEach(item => {
      const type = item.item_type || 'uncategorized'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(item)
    })
    return grouped
  })

  const itemTypes = computed(() => {
    const types = new Set(items.value.map(item => item.item_type || 'uncategorized'))
    return Array.from(types).filter(type => type)
  })

  // Clear error method
  const clearError = () => {
    error.value = null
  }

  // Search items method
  const searchItems = async (query) => {
    loading.value = true
    error.value = null
    try {
      const response = await itemsService.search(query)
      if (response.success) {
        items.value = response.data || []
      } else {
        error.value = response.error || 'Gagal mencari items'
      }
    } catch (err) {
      error.value = err.message || 'Gagal mencari items'
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    updateItemAvailability,
    toggleItemStatus,
    searchItems,
    clearError,
    availableItems,
    itemsByType,
    itemTypes
  }
}

// Form composable for item management
export const useItemForm = () => {
  const form = ref({
    item_name: '',
    price: '',
    item_type: '',
    is_available: true,
    description: '',
    image_url: '',
    image_file: null,
    image_preview: null
  })

  const formErrors = ref({})

  const resetForm = () => {
    form.value = {
      item_name: '',
      price: '',
      item_type: '',
      is_available: true,
      description: '',
      image_url: '',
      image_file: null,
      image_preview: null
    }
    formErrors.value = {}
  }

  const validateForm = () => {
    const errors = {}
    
    if (!form.value.item_name || !form.value.item_name.trim()) {
      errors.item_name = 'Nama item wajib diisi'
    }
    
    if (!form.value.price || parseFloat(form.value.price) <= 0) {
      errors.price = 'Harga harus lebih dari 0'
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const setFormData = (itemData) => {
    form.value = {
      item_name: itemData.item_name || '',
      price: itemData.price || '',
      item_type: itemData.item_type || '',
      is_available: itemData.is_available ?? true,
      description: itemData.description || '',
      image_url: itemData.image_url || ''
    }
  }

  const getFormData = () => {
    return {
      ...form.value,
      price: parseFloat(form.value.price)
    }
  }

  const isValid = computed(() => {
    return form.value.item_name?.trim() && 
           form.value.price && 
           parseFloat(form.value.price) > 0
  })

  // Image handling methods
  const setImageFile = (file) => {
    form.value.image_file = file
    
    if (file) {
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        form.value.image_preview = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      form.value.image_preview = null
    }
  }

  const removeImage = () => {
    form.value.image_file = null
    form.value.image_preview = null
    form.value.image_url = ''
  }

  const getImageBase64 = () => {
    return new Promise((resolve, reject) => {
      if (!form.value.image_file) {
        resolve(null)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        // Remove data:image/png;base64, prefix
        const base64Data = reader.result.split(',')[1]
        resolve({
          data_base64: base64Data,
          content_type: form.value.image_file.type,
          file_name: form.value.image_file.name
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(form.value.image_file)
    })
  }

  return {
    form,
    formErrors,
    isValid,
    resetForm,
    validateForm,
    setFormData,
    getFormData,
    setImageFile,
    removeImage,
    getImageBase64
  }
}
