<template>
  <AppLayout>
    <div class="kasir-container">
      <header class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Manajemen Kasir</h1>
            <p>Kelola sistem kasir dan pengaturan transaksi</p>
          </div>
          <div class="header-actions">
            <RouterLink to="/pos" class="btn-primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
              </svg>
              Buka Kasir
            </RouterLink>
          </div>
        </div>
      </header>

      <div class="kasir-content">
        <!-- Kasir Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Transaksi Hari Ini</h3>
              <p class="stat-value">{{ todayTransactions }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20m8-10H4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Penjualan Hari Ini</h3>
              <p class="stat-value">Rp {{ formatPrice(todaySales) }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Produk Tersedia</h3>
              <p class="stat-value">{{ availableProducts }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-grid">
          <div class="action-card">
            <div class="action-icon primary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>Buka Kasir</h3>
              <p>Mulai transaksi baru untuk melayani pelanggan</p>
              <RouterLink to="/pos" class="action-btn primary">
                Mulai Transaksi
              </RouterLink>
            </div>
          </div>

          <div class="action-card">
            <div class="action-icon secondary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>Riwayat Transaksi</h3>
              <p>Lihat dan kelola semua transaksi yang telah dilakukan</p>
              <RouterLink to="/transactions" class="action-btn secondary">
                Lihat Riwayat
              </RouterLink>
            </div>
          </div>

          <div class="action-card">
            <div class="action-icon success">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>Kelola Produk</h3>
              <p>Tambah, edit, dan kelola produk yang dijual</p>
              <RouterLink to="/items" class="action-btn success">
                Kelola Produk
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Recent Transactions with Images -->
        <div class="recent-section">
          <div class="section-header">
            <h2>Transaksi Terbaru</h2>
            <RouterLink to="/transactions" class="view-all-link">
              Lihat Semua
            </RouterLink>
          </div>

          <div v-if="recentTransactionsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat transaksi terbaru...</p>
          </div>

          <div v-else-if="recentTransactions.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>Belum Ada Transaksi</h3>
            <p>Mulai transaksi pertama Anda</p>
            <RouterLink to="/pos" class="btn-primary">
              Buka Kasir
            </RouterLink>
          </div>

          <div v-else class="transactions-list">
            <div 
              v-for="transaction in recentTransactions" 
              :key="transaction.id_transaction"
              class="transaction-item"
            >
              <div class="transaction-id">
                <strong>#{{ transaction.id_transaction?.slice(-8) || 'Unknown' }}</strong>
                <span class="transaction-date">{{ formatDate(transaction.created_at) }}</span>
              </div>
              
              <div class="transaction-items">
                <div class="items-preview">
                  <div 
                    v-for="(item, index) in transaction.transaction_items?.slice(0, 3)" 
                    :key="item.id || index"
                    class="item-preview"
                  >
                    <div class="item-image">
                      <img 
                        :src="getTransactionItemImageSrc(item)" 
                        :alt="item.item?.item_name || 'Product'"
                        @error="handleTransactionImageError"
                        loading="lazy"
                      />
                    </div>
                    <div class="item-info">
                      <span class="item-name">{{ item.item?.item_name || 'Unknown Item' }}</span>
                      <span class="item-qty">{{ item.quantity }}x</span>
                    </div>
                  </div>
                  
                  <div v-if="(transaction.transaction_items?.length || 0) > 3" class="more-items">
                    +{{ (transaction.transaction_items?.length || 0) - 3 }} lainnya
                  </div>
                </div>
              </div>
              
              <div class="transaction-total">
                <span class="total-label">Total:</span>
                <span class="total-amount">Rp {{ formatPrice(transaction.total_price || 0) }}</span>
              </div>
              
              <div class="transaction-actions">
                <button 
                  @click="viewTransactionDetail(transaction.id_transaction)"
                  class="btn-detail"
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Images Gallery -->
        <div class="product-gallery-section">
          <div class="section-header">
            <h2>Gallery Produk</h2>
            <RouterLink to="/items" class="view-all-link">
              Kelola Produk
            </RouterLink>
          </div>

          <div v-if="itemsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Memuat produk...</p>
          </div>

          <div v-else class="product-gallery">
            <div 
              v-for="item in featuredProducts" 
              :key="item.id_item"
              class="gallery-item"
              @click="viewProductDetail(item)"
            >
              <div class="gallery-image">
                <img 
                  :src="getProductImageSrc(item)" 
                  :alt="item.item_name"
                  @error="handleProductImageError"
                  loading="lazy"
                />
                <div class="image-overlay">
                  <div class="overlay-content">
                    <h4>{{ item.item_name }}</h4>
                    <p>Rp {{ formatPrice(item.price) }}</p>
                    <span class="availability" :class="{ 'available': item.is_available }">
                      {{ item.is_available ? 'Tersedia' : 'Tidak Tersedia' }}
                    </span>
                  </div>
                </div>
              </div>
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
import { useTransactions } from '../composables/useTransactions.js'
import { useItems } from '../composables/useItems.js'
import imagesService from '../services/imagesService.js'

const router = useRouter()

// Composables
const { 
  loading: transactionsLoading, 
  transactions, 
  loadTransactions,
  getTransactionById
} = useTransactions()

const { 
  loading: itemsLoading, 
  items, 
  loadItems 
} = useItems()

// Reactive data
const recentTransactionsLoading = ref(false)
const todayTransactions = ref(0)
const todaySales = ref(0)
const availableProducts = ref(0)

// Computed properties
const recentTransactions = computed(() => {
  return transactions.value?.slice(0, 5) || []
})

const featuredProducts = computed(() => {
  return items.value?.filter(item => item.is_available)?.slice(0, 8) || []
})

// Image handling functions
const getProductImageSrc = (item) => {
  const itemId = item.id_item || item.id
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000/api/images/file'
  
  console.log(`🖼️ [Kasir Management Item ${itemId}] Processing image for: ${item.item_name}`)
  
  // Priority 1: Check for image filename field (UUID filename)
  if (item.image) {
    const fullImageUrl = `${imageBaseUrl}/${item.image}`
    console.log(`🖼️ [Kasir Management Item ${itemId}] Using image field (${item.image}): ${fullImageUrl}`)
    return fullImageUrl
  }
  
  // Priority 2: Check for image_filename field (UUID filename)
  if (item.image_filename) {
    const fullImageUrl = `${imageBaseUrl}/${item.image_filename}`
    console.log(`🖼️ [Kasir Management Item ${itemId}] Using image_filename field (${item.image_filename}): ${fullImageUrl}`)
    return fullImageUrl
  }
  
  // Priority 3: If item has direct image_url, use it with base URL if it's a relative path
  if (item.image_url) {
    if (item.image_url.startsWith('http')) {
      console.log(`🖼️ [Kasir Management Item ${itemId}] Using direct HTTP image_url: ${item.image_url}`)
      return item.image_url
    }
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000'
    const fullUrl = `${baseUrl}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`
    console.log(`🖼️ [Kasir Management Item ${itemId}] Constructed URL from relative image_url: ${fullUrl}`)
    return fullUrl
  }
  
  // Fallback: Generate URL from item name (for testing)
  console.warn(`🖼️ [Kasir Management Item ${itemId}] No image filename found for: ${item.item_name}`)
  const fallbackUrl = 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=' + encodeURIComponent(item.item_name?.substring(0, 10) || 'No+Image')
  console.log(`🖼️ [Kasir Management Item ${itemId}] Using fallback placeholder: ${fallbackUrl}`)
  return fallbackUrl
}

const getTransactionItemImageSrc = (transactionItem) => {
  if (transactionItem.item) {
    return getProductImageSrc(transactionItem.item)
  }
  
  return 'https://via.placeholder.com/40x40/6b7280/ffffff?text=?'
}

const handleProductImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/200x150/ff6b6b/ffffff?text=Error'
}

const handleTransactionImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/40x40/ff6b6b/ffffff?text=Error'
}

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const viewTransactionDetail = (transactionId) => {
  router.push(`/transactions/${transactionId}`)
}

const viewProductDetail = (product) => {
  router.push(`/items/${product.id_item}`)
}

const calculateStats = () => {
  const today = new Date().toDateString()
  
  const todayTrans = transactions.value?.filter(transaction => {
    const transDate = new Date(transaction.created_at).toDateString()
    return transDate === today
  }) || []
  
  todayTransactions.value = todayTrans.length
  todaySales.value = todayTrans.reduce((sum, transaction) => {
    return sum + (transaction.total_price || 0)
  }, 0)
  
  availableProducts.value = items.value?.filter(item => item.is_available)?.length || 0
}

// Load data
onMounted(async () => {
  try {
    recentTransactionsLoading.value = true
    
    await Promise.all([
      loadTransactions(),
      loadItems()
    ])
    
    calculateStats()
    
  } catch (error) {
    console.error('Error loading kasir data:', error)
  } finally {
    recentTransactionsLoading.value = false
  }
})
</script>

<style scoped>
.kasir-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.header-content {
  max-width: 1200px;
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

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
  text-decoration: none;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.kasir-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.stat-icon.green {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #059669;
}

.stat-icon.orange {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  color: #ea580c;
}

.stat-info h3 {
  margin: 0 0 0.25rem 0;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: all 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.action-icon.secondary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
}

.action-icon.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
}

.action-content p {
  margin: 0 0 1.5rem 0;
  color: #64748b;
  line-height: 1.5;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #6366f1;
  color: white;
}

.action-btn.secondary:hover {
  background: #4f46e5;
}

.action-btn.success {
  background: #10b981;
  color: white;
}

.action-btn.success:hover {
  background: #059669;
}

.recent-section,
.product-gallery-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
}

.view-all-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.view-all-link:hover {
  color: #2563eb;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
}

.transactions-list {
  padding: 0;
}

.transaction-item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-id strong {
  display: block;
  color: #111827;
  font-size: 0.875rem;
}

.transaction-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.items-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.item-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.item-image {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
}

.item-qty {
  font-size: 0.625rem;
  color: #6b7280;
}

.more-items {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.transaction-total {
  text-align: right;
}

.total-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.total-amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
}

.btn-detail {
  padding: 0.5rem 1rem;
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-detail:hover {
  background: #f1f5f9;
  border-color: #d1d5db;
}

.product-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.overlay-content p {
  margin: 0 0 0.25rem 0;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.availability {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.availability.available {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .kasir-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .transaction-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: left;
  }

  .transaction-total {
    text-align: left;
  }

  .product-gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 1rem;
  }
}
</style>
