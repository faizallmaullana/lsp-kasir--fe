<template>
  <AppLayout>
    <div class="pos-container">
      <header class="pos-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Kasir - Transaksi Baru</h1>
            <p>Pilih produk dan proses pembayaran</p>
          </div>
          <div class="header-actions">
            <RouterLink to="/transactions" class="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Riwayat Transaksi
            </RouterLink>
          </div>
        </div>
      </header>

      <div class="pos-content">
        <!-- Left Panel - Product Selection -->
        <div class="product-panel">
          <div class="product-search">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19 19l-4-4m0-7A7 7 0 111 8a7 7 0 0114 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Cari produk..."
                class="search-input"
              />
            </div>
            <div class="category-tabs">
              <button 
                v-for="category in availableCategories" 
                :key="category.value"
                :class="['category-btn', { active: selectedCategory === category.value }]"
                @click="selectedCategory = category.value"
              >
                {{ category.label }}
              </button>
            </div>
          </div>

          <div class="product-grid">
            <div v-if="itemsLoading" class="loading-state">
              <p>Memuat produk...</p>
            </div>
            <div 
              v-for="item in filteredProducts" 
              :key="item.id_item"
              class="product-card"
              @click="addToCart(item)"
              :class="{ 'out-of-stock': !item.is_available }"
            >
              <div class="product-image">
                <img :src="item.image_url || 'https://via.placeholder.com/150x120/3b82f6/ffffff?text=No+Image'" :alt="item.item_name" />
                <div v-if="!item.is_available" class="out-of-stock-badge">
                  Tidak Tersedia
                </div>
              </div>
              <div class="product-info">
                <h3>{{ item.item_name }}</h3>
                <p class="product-type">{{ getItemTypeText(item.item_type) }}</p>
                <p class="product-price">Rp {{ formatPrice(item.price) }}</p>
                <p class="product-stock">{{ item.is_available ? 'Tersedia' : 'Tidak Tersedia' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Cart and Checkout -->
        <div class="cart-panel">
          <div class="cart-header">
            <h2>Keranjang</h2>
            <button 
              v-if="cart.length > 0" 
              @click="clearCart"
              class="clear-cart-btn"
            >
              Hapus Semua
            </button>
          </div>

          <div class="cart-content">
            <div v-if="cart.length === 0" class="empty-cart">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M7 13v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6 0a2 2 0 002-2V9a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2" stroke="currentColor" stroke-width="2"/>
              </svg>
              <p>Keranjang masih kosong</p>
              <span>Pilih produk untuk memulai transaksi</span>
            </div>

            <div v-else class="cart-items">
              <div 
                v-for="item in cart" 
                :key="item.id_item"
                class="cart-item"
              >
                <div class="item-info">
                  <h4>{{ item.item_name }}</h4>
                  <p class="item-price">Rp {{ formatPrice(item.price) }}</p>
                </div>
                <div class="item-controls">
                  <button 
                    @click="updateQuantity(item.id_item, item.quantity - 1)"
                    class="quantity-btn"
                    :disabled="item.quantity <= 1"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(item.id_item, item.quantity + 1)"
                    class="quantity-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                <div class="item-total">
                  Rp {{ formatPrice(item.price * item.quantity) }}
                </div>
                <button 
                  @click="removeFromCart(item.id_item)"
                  class="remove-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="cart.length > 0" class="cart-summary">
            <div class="summary-row">
              <span>Subtotal ({{ totalItems }} item)</span>
              <span>Rp {{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Pajak ({{ taxRate }}%)</span>
              <span>Rp {{ formatPrice(taxAmount) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>Rp {{ formatPrice(total) }}</span>
            </div>

            <button 
              @click="proceedToPayment"
              class="checkout-btn"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Proses Pembayaran
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div v-if="showPaymentModal" class="modal-overlay">
        <div class="payment-modal">
          <div class="modal-header">
            <h2>Pembayaran</h2>
            <button @click="closePaymentModal" class="close-btn">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>

          <div class="modal-content">
            <!-- Order Summary -->
            <div class="order-summary">
              <h3>Ringkasan Pesanan</h3>
              <div class="order-items">
                <div v-for="item in cart" :key="item.id_item" class="order-item">
                  <span>{{ item.item_name }} × {{ item.quantity }}</span>
                  <span>Rp {{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
              <div class="order-total">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>Rp {{ formatPrice(subtotal) }}</span>
                </div>
                <div class="total-row">
                  <span>Pajak ({{ taxRate }}%)</span>
                  <span>Rp {{ formatPrice(taxAmount) }}</span>
                </div>
                <div class="total-row final-total">
                  <span>Total Bayar</span>
                  <span>Rp {{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Form -->
            <div class="payment-form">
              <div class="buyer-contact-group">
                <label>Kontak Pembeli (Opsional)</label>
                <input 
                  type="text" 
                  v-model="buyerContact" 
                  class="contact-input"
                  placeholder="Nomor HP atau nama pembeli"
                />
              </div>
              
              <h3>Jumlah Bayar</h3>
              <div class="amount-input-group">
                <label>Uang Diterima</label>
                <input 
                  type="number" 
                  v-model="paidAmount" 
                  @input="calculateChange"
                  class="amount-input"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div class="quick-amounts">
                <button 
                  v-for="amount in quickAmounts" 
                  :key="amount"
                  @click="setPaidAmount(amount)"
                  class="quick-amount-btn"
                >
                  Rp {{ formatPrice(amount) }}
                </button>
                <button 
                  @click="setPaidAmount(total)"
                  class="quick-amount-btn exact"
                >
                  Uang Pas
                </button>
              </div>

              <div class="change-display">
                <div class="change-label">Kembalian</div>
                <div class="change-amount" :class="{ 'insufficient': change < 0 }">
                  Rp {{ formatPrice(Math.abs(change)) }}
                  <span v-if="change < 0" class="insufficient-text">(Kurang)</span>
                </div>
              </div>

              <div class="payment-actions">
                <button 
                  @click="closePaymentModal"
                  class="btn-cancel"
                >
                  Batal
                </button>
                <button 
                  @click="processPayment"
                  :disabled="change < 0 || !paidAmount"
                  class="btn-pay"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="success-modal">
          <div class="success-content">
            <div class="success-icon">
              <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h2>Pembayaran Berhasil!</h2>
            <div class="transaction-details">
              <p><strong>No. Transaksi:</strong> {{ transactionId }}</p>
              <p><strong>Total:</strong> Rp {{ formatPrice(total) }}</p>
              <p><strong>Bayar:</strong> Rp {{ formatPrice(paidAmount) }}</p>
              <p><strong>Kembalian:</strong> Rp {{ formatPrice(change) }}</p>
            </div>
            <div class="success-actions">
              <button @click="printReceipt" class="btn-print">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Cetak Struk
              </button>
              <button @click="newTransaction" class="btn-new">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2"/>
                </svg>
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useCart, useTransactions } from '../composables/useTransactions.js'
import { useItems } from '../composables/useItems.js'

const router = useRouter()

// Composables
const { loading: itemsLoading, items, loadItems } = useItems()
const { 
  loading: transactionLoading, 
  createTransaction 
} = useTransactions()
const {
  cart,
  buyerContact,
  cartTotal,
  cartItemCount,
  cartTotalFormatted,
  addToCart: addItemToCart,
  removeFromCart: removeItemFromCart,
  updateCartItemQuantity,
  clearCart: clearAllCart,
  getTransactionData
} = useCart()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const paidAmount = ref(0)
const transactionId = ref('')
const taxRate = 0 // No tax for now, keep it simple

// Available categories computed from actual items
const availableCategories = computed(() => {
  const baseCategories = [
    { value: '', label: 'Semua' },
    { value: 'food', label: 'Makanan' },
    { value: 'beverage', label: 'Minuman' },
    { value: 'snack', label: 'Snack' },
    { value: 'electronics', label: 'Elektronik' },
    { value: 'clothing', label: 'Pakaian' },
    { value: 'other', label: 'Lainnya' }
  ]

  // Get unique item types from available items
  const availableTypes = [...new Set(
    items.value
      .filter(item => item.is_available && !item.is_deleted)
      .map(item => item.item_type)
      .filter(type => type)
  )]

  // Return only categories that have available items
  return baseCategories.filter(category => 
    category.value === '' || availableTypes.includes(category.value)
  )
})

// Computed properties
const filteredProducts = computed(() => {
  let filtered = items.value.filter(item => 
    item.is_available && !item.is_deleted
  )

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.item_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by item type
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.item_type === selectedCategory.value)
  }

  return filtered
})

const totalItems = computed(() => {
  return cartItemCount.value
})

const subtotal = computed(() => {
  return cartTotal.value
})

const taxAmount = computed(() => {
  return Math.round(subtotal.value * (taxRate / 100))
})

const total = computed(() => {
  return subtotal.value + taxAmount.value
})

const change = computed(() => {
  return paidAmount.value - total.value
})

const quickAmounts = computed(() => {
  const baseAmounts = [50000, 100000, 200000]
  const totalAmount = total.value
  
  // Add some amounts based on total
  const suggestions = []
  
  // Add exact amount + some round numbers
  const roundUp = Math.ceil(totalAmount / 10000) * 10000
  if (roundUp > totalAmount) suggestions.push(roundUp)
  
  // Add base amounts that are greater than total
  baseAmounts.forEach(amount => {
    if (amount > totalAmount) suggestions.push(amount)
  })
  
  return [...new Set(suggestions)].sort((a, b) => a - b).slice(0, 3)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const getItemTypeText = (itemType) => {
  const typeMap = {
    'food': 'Makanan',
    'beverage': 'Minuman',
    'snack': 'Snack',
    'electronics': 'Elektronik',
    'clothing': 'Pakaian',
    'other': 'Lainnya'
  }
  return typeMap[itemType] || 'Umum'
}

const addToCart = (item) => {
  if (!item.is_available) return
  
  addItemToCart(item, 1)
}

const updateQuantity = (itemId, newQuantity) => {
  updateCartItemQuantity(itemId, newQuantity)
}

const removeFromCart = (itemId) => {
  removeItemFromCart(itemId)
}

const clearCart = () => {
  if (confirm('Hapus semua item dari keranjang?')) {
    clearAllCart()
  }
}

const proceedToPayment = () => {
  showPaymentModal.value = true
  paidAmount.value = 0
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  paidAmount.value = 0
}

const setPaidAmount = (amount) => {
  paidAmount.value = amount
}

const calculateChange = () => {
  // Change is calculated automatically via computed property
}

const processPayment = async () => {
  if (change.value < 0 || !paidAmount.value) return

  // Check authentication before proceeding
  const token = localStorage.getItem('auth_token')
  if (!token) {
    alert('Anda harus login terlebih dahulu untuk memproses transaksi.')
    router.push('/login')
    return
  }

  try {
    console.log('Processing payment...')
    
    // Prepare transaction data
    const transactionData = getTransactionData()
    transactionData.buyer_contact = buyerContact.value
    
    console.log('Transaction data:', transactionData)
    
    // Create transaction via API
    const success = await createTransaction(transactionData)
    
    if (success) {
      console.log('Transaction created successfully')
      // Generate display transaction ID (or use from response if available)
      transactionId.value = `TRX${Date.now().toString().slice(-8)}`
      
      // Close payment modal and show success
      showPaymentModal.value = false
      showSuccessModal.value = true
    } else {
      console.error('Transaction creation failed')
      alert('Gagal memproses pembayaran. Silakan coba lagi.')
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    
    if (error.response?.status === 401) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      router.push('/login')
    } else {
      alert('Terjadi kesalahan saat memproses pembayaran: ' + (error.message || 'Unknown error'))
    }
  }
}

const printReceipt = () => {
  // TODO: Implement receipt printing
  alert('Struk akan dicetak (fitur belum diimplementasi)')
}

const newTransaction = () => {
  // Reset everything
  clearAllCart()
  paidAmount.value = 0
  transactionId.value = ''
  showSuccessModal.value = false
  searchQuery.value = ''
  selectedCategory.value = ''
}

// Load items when component mounts
onMounted(async () => {
  try {
    // Check authentication status
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    console.log('Auth check:')
    console.log('- Token exists:', !!token)
    console.log('- User data exists:', !!userData)
    
    if (!token) {
      console.warn('No authentication token found!')
      // Optionally redirect to login
      // router.push('/login')
    }
    
    await loadItems()
  } catch (error) {
    console.error('Error loading items:', error)
  }
})
</script>

<style scoped>
.pos-container {
  background: #f8fafc;
}

.pos-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left h1 {
  color: #1e40af;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-left p {
  color: #64748b;
  margin: 0;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.pos-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  min-height: calc(100vh - 200px);
}

/* Product Panel */
.product-panel {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.product-search {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #64748b;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #cbd5e1;
}

.category-btn.active {
  border-color: #3b82f6;
  background: #dbeafe;
  color: #1d4ed8;
}

.product-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.product-card {
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.product-card:hover:not(.out-of-stock) {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.15);
}

.product-card.out-of-stock {
  opacity: 0.6;
  cursor: not-allowed;
}

.product-image {
  position: relative;
  margin-bottom: 0.75rem;
}

.product-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.out-of-stock-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-info h3 {
  margin: 0 0 0.25rem 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 600;
}

.product-type {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  display: inline-block;
}

.product-price {
  margin: 0 0 0.25rem 0;
  color: #059669;
  font-weight: 700;
  font-size: 1.125rem;
}

.product-stock {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Cart Panel */
.cart-panel {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 250px);
  position: sticky;
  top: 2rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.cart-header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
}

.clear-cart-btn {
  padding: 0.5rem 0.75rem;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.clear-cart-btn:hover {
  background: #fee2e2;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #64748b;
}

.empty-cart svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.empty-cart span {
  font-size: 0.875rem;
}

.cart-items {
  padding: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid #f1f5f9;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
}

.item-price {
  margin: 0;
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 2rem;
  height: 2rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
  color: #374151;
}

.item-total {
  color: #111827;
  font-weight: 700;
  text-align: right;
}

.remove-btn {
  width: 2rem;
  height: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.25rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee2e2;
}

.cart-summary {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #374151;
}

.summary-row.total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
}

.checkout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.checkout-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.payment-modal, .success-modal {
  background: white;
  border-radius: 0.75rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #64748b;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.modal-content {
  padding: 2rem;
}

.order-summary {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.order-summary h3 {
  margin: 0 0 1rem 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #374151;
}

.order-total {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #374151;
}

.total-row.final-total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
}

.payment-form h3 {
  margin: 0 0 1rem 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
}

.amount-input-group {
  margin-bottom: 1.5rem;
}

.amount-input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.amount-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
}

.amount-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.quick-amount-btn {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.quick-amount-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.quick-amount-btn.exact {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1d4ed8;
}

.change-display {
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.change-display.insufficient {
  background: #fef2f2;
  border-color: #fecaca;
}

.change-label {
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.change-amount {
  color: #059669;
  font-size: 2rem;
  font-weight: 700;
}

.change-amount.insufficient {
  color: #dc2626;
}

.insufficient-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.payment-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel, .btn-pay {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-pay {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(5, 150, 105, 0.39);
}

.btn-pay:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  transform: translateY(-1px);
}

.btn-pay:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Success Modal */
.success-modal {
  max-width: 500px;
}

.success-content {
  padding: 3rem 2rem;
  text-align: center;
}

.success-icon {
  color: #059669;
  margin-bottom: 1.5rem;
}

.success-content h2 {
  margin: 0 0 1.5rem 0;
  color: #111827;
  font-size: 1.875rem;
  font-weight: 700;
}

.transaction-details {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.transaction-details p {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.transaction-details p:last-child {
  margin-bottom: 0;
}

.success-actions {
  display: flex;
  gap: 1rem;
}

.btn-print, .btn-new {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-print {
  background: #f1f5f9;
  color: #475569;
}

.btn-print:hover {
  background: #e2e8f0;
}

.btn-new {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.btn-new:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .pos-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  
  .cart-panel {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .pos-content {
    padding: 1rem;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    text-align: center;
  }
  
  .quick-amounts {
    grid-template-columns: 1fr;
  }
  
  .success-actions,
  .payment-actions {
    flex-direction: column;
  }
}

/* Additional styles for API integration */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #64748b;
}

.buyer-contact-group {
  margin-bottom: 1.5rem;
}

.buyer-contact-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.contact-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.contact-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
