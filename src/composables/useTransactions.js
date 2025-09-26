import { ref, computed } from 'vue'
import transactionsService from '../services/transactionsService'

const transactions = ref([])
const loading = ref(false)
const error = ref(null)

export const useTransactions = () => {
  const loadTransactions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await transactionsService.getAllWithItems()
      if (response.success) {
        transactions.value = response.data || []
      } else {
        error.value = response.error || 'Gagal memuat data transaksi'
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat data transaksi'
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (transactionData) => {
    loading.value = true
    error.value = null
    try {
      const response = await transactionsService.create(transactionData)
      if (response.success) {
        transactions.value.unshift(response.data)
        return response.data
      } else {
        error.value = response.error || 'Gagal membuat transaksi'
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Gagal membuat transaksi'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await transactionsService.getById(id)
      if (response.success) {
        return response.data
      } else {
        error.value = response.error || 'Transaksi tidak ditemukan'
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat detail transaksi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const totalTransactions = computed(() => transactions.value.length)
  
  const totalRevenue = computed(() => {
    return transactions.value.reduce((sum, transaction) => {
      return sum + (transaction.total || 0)
    }, 0)
  })

  const todayTransactions = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return transactions.value.filter(transaction => {
      const transactionDate = new Date(transaction.created_at).toISOString().split('T')[0]
      return transactionDate === today
    })
  })

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    createTransaction,
    getTransactionById,
    totalTransactions,
    totalRevenue,
    todayTransactions
  }
}

// Cart composable for managing shopping cart
export const useCart = () => {
  const cart = ref([])
  const cartTotal = ref(0)

  const addToCart = (item) => {
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.value.push({
        ...item,
        quantity: 1
      })
    }
    
    calculateTotal()
  }

  const removeFromCart = (itemId) => {
    cart.value = cart.value.filter(item => item.id !== itemId)
    calculateTotal()
  }

  const updateQuantity = (itemId, quantity) => {
    const item = cart.value.find(cartItem => cartItem.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
    calculateTotal()
  }

  const incrementQuantity = (itemId) => {
    const item = cart.value.find(cartItem => cartItem.id === itemId)
    if (item) {
      item.quantity += 1
    }
    calculateTotal()
  }

  const decrementQuantity = (itemId) => {
    const item = cart.value.find(cartItem => cartItem.id === itemId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeFromCart(itemId)
      }
    }
    calculateTotal()
  }

  const clearCart = () => {
    cart.value = []
    cartTotal.value = 0
  }

  const calculateTotal = () => {
    cartTotal.value = cart.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  const getCartData = () => {
    return {
      items: cart.value.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal.value
    }
  }

  // Computed properties
  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0)
  })

  const cartIsEmpty = computed(() => cart.value.length === 0)

  const cartItems = computed(() => cart.value)

  return {
    cart: cartItems,
    cartTotal,
    cartItemCount,
    cartIsEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    calculateTotal,
    getCartData
  }
}

// Transaction form composable
export const useTransactionForm = () => {
  const form = ref({
    customer_name: '',
    payment_method: 'cash',
    items: [],
    total: 0,
    notes: ''
  })

  const formErrors = ref({})

  const resetForm = () => {
    form.value = {
      customer_name: '',
      payment_method: 'cash',
      items: [],
      total: 0,
      notes: ''
    }
    formErrors.value = {}
  }

  const validateForm = () => {
    const errors = {}
    
    if (!form.value.items || form.value.items.length === 0) {
      errors.items = 'Minimal harus ada 1 item dalam transaksi'
    }
    
    if (!form.value.payment_method) {
      errors.payment_method = 'Metode pembayaran wajib dipilih'
    }
    
    if (form.value.total <= 0) {
      errors.total = 'Total transaksi harus lebih dari 0'
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const setFormData = (transactionData) => {
    form.value = {
      customer_name: transactionData.customer_name || '',
      payment_method: transactionData.payment_method || 'cash',
      items: transactionData.items || [],
      total: transactionData.total || 0,
      notes: transactionData.notes || ''
    }
  }

  const getFormData = () => {
    return {
      ...form.value
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
