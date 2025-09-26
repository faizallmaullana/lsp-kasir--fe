import { ref, computed } from 'vue'
import itemsService from '../services/itemsService'

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
      // Convert form data to API format
      const apiData = {
        item_name: itemData.name,
        price: itemData.price,
        item_type: itemData.item_type,
        is_available: itemData.is_available,
        description: itemData.description
      }
      
      const response = await itemsService.create(apiData)
      if (response.success) {
        items.value.push(response.data)
        return response.data
      } else {
        error.value = response.error || 'Gagal menambah item'
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Gagal menambah item'
      throw err
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

  const toggleItemStatus = async (id, isAvailable) => {
    loading.value = true
    error.value = null
    try {
      const response = await itemsService.updateAvailability(id, isAvailable)
      if (response.success) {
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value[index] = response.data
        }
        return response.data
      } else {
        error.value = response.error || 'Gagal mengubah status item'
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengubah status item'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const availableItems = computed(() => {
    return items.value.filter(item => item.is_available)
  })

  const itemsByType = computed(() => {
    const grouped = {}
    items.value.forEach(item => {
      if (!grouped[item.item_type]) {
        grouped[item.item_type] = []
      }
      grouped[item.item_type].push(item)
    })
    return grouped
  })

  const itemTypes = computed(() => {
    const types = new Set(items.value.map(item => item.item_type))
    return Array.from(types).filter(type => type)
  })

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    toggleItemStatus,
    availableItems,
    itemsByType,
    itemTypes
  }
}

// Form composable for item management
export const useItemForm = () => {
  const form = ref({
    name: '',
    price: '',
    item_type: 'makanan',
    is_available: true,
    description: ''
  })

  const formErrors = ref({})

  const resetForm = () => {
    form.value = {
      name: '',
      price: '',
      item_type: 'makanan',
      is_available: true,
      description: ''
    }
    formErrors.value = {}
  }

  const validateForm = () => {
    const errors = {}
    
    if (!form.value.name.trim()) {
      errors.name = 'Nama item wajib diisi'
    }
    
    if (!form.value.price || form.value.price <= 0) {
      errors.price = 'Harga harus lebih dari 0'
    }
    
    if (!form.value.item_type) {
      errors.item_type = 'Tipe item wajib dipilih'
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const setFormData = (itemData) => {
    form.value = {
      name: itemData.name || '',
      price: itemData.price || '',
      item_type: itemData.item_type || 'makanan',
      is_available: itemData.is_available ?? true,
      description: itemData.description || ''
    }
  }

  const getFormData = () => {
    return {
      ...form.value,
      price: parseFloat(form.value.price)
    }
  }

  return {
    form,
    formErrors,
    resetForm,
    validateForm,
    setFormData,
    getFormData
  }
}
