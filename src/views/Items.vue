<template>
  <AppLayout>
  <div class="items-container">
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1>Kelola Produk</h1>
          <p>Daftar semua produk dalam sistem kasir</p>
        </div>
        <div class="header-actions">
          <RouterLink to="/items/add" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Tambah Produk
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="items-content">
      <!-- Filter dan Search -->
      <div class="filter-section">
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19 19l-4-4m0-7A7 7 0 111 8a7 7 0 0114 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input 
            type="text" 
            v-model="localSearchQuery" 
            placeholder="Cari produk..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="localSelectedCategory" class="filter-select">
            <option value="">Semua Kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="snack">Snack</option>
            <option value="elektronik">Elektronik</option>
            <option value="pakaian">Pakaian</option>
          </select>
          <select v-model="localSortBy" class="filter-select">
            <option value="name">Urutkan: Nama</option>
            <option value="price">Urutkan: Harga</option>
            <option value="stock">Urutkan: Stok</option>
            <option value="category">Urutkan: Kategori</option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Total Produk</h3>
            <p class="stat-value">{{ displayItems.length }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Produk Tersedia</h3>
            <p class="stat-value">{{ availableCount }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Tidak Tersedia</h3>
            <p class="stat-value text-warning">{{ unavailableCount }}</p>
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="items-grid">
        <div 
          v-for="item in displayItems" 
          :key="item.id_item || item.id" 
          class="item-card"
          @click="openItemDetail(item)"
        >
          <div class="item-image">
            <img :src="item.image_url || item.image || 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=No+Image'" :alt="item.item_name || item.name" />
            <div class="item-badge" :class="getStatusBadgeClass(item.is_available)">
              {{ getStatusBadgeText(item.is_available) }}
            </div>
          </div>
          <div class="item-info">
            <div class="item-header">
              <h3>{{ item.item_name || item.name }}</h3>
              <span class="item-category">{{ getItemTypeText(item.item_type) }}</span>
            </div>
            <p class="item-description">{{ item.description || 'Tidak ada deskripsi' }}</p>
            <div class="item-details">
              <div class="item-price">
                <span class="price-label">Harga:</span>
                <span class="price-value">Rp {{ formatPrice(item.price || 0) }}</span>
              </div>
                            <div class="item-status">
                <span class="status-label">Status:</span>
                <span class="status-value" :class="{ 'available': item.is_available, 'unavailable': !item.is_available }">
                  {{ item.is_available ? 'Tersedia' : 'Tidak Tersedia' }}
                </span>
              </div>
            </div>
            <div class="item-actions">
              <button 
                @click.stop="toggleItemStatus(item)"
                :class="['status-toggle-btn', item.is_available ? 'make-unavailable' : 'make-available']"
                :disabled="loading && loadingItemId === item.id_item"
              >
                <svg v-if="loading && loadingItemId === item.id_item" class="loading-icon" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                  <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
                </svg>
                <span v-else>
                  {{ item.is_available ? 'Tandai Tidak Tersedia' : 'Tandai Tersedia' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ← Sebelumnya
        </button>
        <span class="page-info">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useItems, useItemForm } from '../composables/useItems.js'

const router = useRouter()

// Composables
const { 
  loading, 
  error, 
  items, 
  loadItems, 
  createItem, 
  updateItemAvailability,
  searchItems, 
  clearError,
  pagination,
  nextPage,
  prevPage,
  goToPage
} = useItems()

const {
  form: newItemForm,
  errors: formErrors,
  isValid: isFormValid,
  validateForm,
  reset: resetForm
} = useItemForm()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('all')
const loadingItemId = ref(null)
const localSearchQuery = ref('')
const localSelectedCategory = ref('')
const localSortBy = ref('name')

// Computed properties
const availableCount = computed(() => {
  return items.value.filter(item => item.is_available === true).length
})

const unavailableCount = computed(() => {
  return items.value.filter(item => item.is_available === false).length
})

const displayItems = computed(() => {
  let filtered = items.value.filter(item => {
    const matchesSearch = item.item_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        item.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || 
                         (statusFilter.value === 'available' && item.is_available === true) ||
                         (statusFilter.value === 'unavailable' && item.is_available === false)
    return matchesSearch && matchesStatus
  })
  
  return filtered
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const getStatusBadgeClass = (isAvailable) => {
  if (isAvailable === false) return 'badge-danger'
  return 'badge-success'
}

const getStatusBadgeText = (isAvailable) => {
  if (isAvailable === false) return 'Tidak Tersedia'
  return 'Tersedia'
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

const editItem = (item) => {
  // TODO: Implement edit functionality
  console.log('Edit item:', item)
}

const handleDeleteItem = async (itemId) => {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    const success = await deleteItem(itemId)
    if (success) {
      await loadItems() // Refresh list
    }
  }
}

// Watch untuk search dan filter changes
watch([localSearchQuery, localSelectedCategory], async () => {
  await handleSearch()
}, { debounce: 300 })

// Methods
const handleSearch = async () => {
  if (localSearchQuery.value.trim()) {
    await searchItems(localSearchQuery.value.trim())
  } else {
    await loadItems()
  }
}
// Methods
const toggleItemStatus = async (item) => {
  if (loading.value && loadingItemId.value === item.id_item) return
  
  try {
    loadingItemId.value = item.id_item
    const newStatus = !item.is_available
    
    const success = await updateItemAvailability(item.id_item, newStatus)
    
    if (success) {
      // Status akan diupdate otomatis oleh composable
      console.log(`Item ${item.item_name} status changed to ${newStatus ? 'available' : 'unavailable'}`)
    } else {
      console.error('Failed to update item status:', error.value)
    }
  } catch (err) {
    console.error('Error updating item status:', err)
  } finally {
    loadingItemId.value = null
  }
}

const openItemDetail = (item) => {
  router.push(`/items/${item.id_item || item.id}`)
}

onMounted(async () => {
  try {
    await loadItems()
  } catch (error) {
    console.error('Error loading items:', error)
  }
})
</script>

<style scoped>
.items-container {
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

.items-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
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

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.text-warning {
  color: #ea580c !important;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.item-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
}

.item-image {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.badge-success {
  background: #059669;
}

.badge-warning {
  background: #ea580c;
}

.badge-danger {
  background: #dc2626;
}

.item-info {
  padding: 1.25rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.item-header h3 {
  margin: 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
}

.item-category {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.item-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
}

.item-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.item-price, .item-stock {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label, .stock-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 500;
}

.price-value {
  color: #059669;
  font-weight: 700;
  font-size: 1.125rem;
}

.stock-value {
  color: #374151;
  font-weight: 600;
}

.stock-value.low-stock {
  color: #dc2626;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-secondary, .btn-danger {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-danger {
  background: #fef2f2;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fee2e2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #64748b;
  font-size: 0.875rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Item Actions */
.item-actions {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.status-toggle-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.status-toggle-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-toggle-btn.make-unavailable {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.status-toggle-btn.make-unavailable:hover:not(:disabled) {
  background-color: #fde68a;
}

.status-toggle-btn.make-available {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #22c55e;
}

.status-toggle-btn.make-available:hover:not(:disabled) {
  background-color: #bbf7d0;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .items-content {
    padding: 1rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filter-controls {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}

/* Toggle Status Button Styles */
.item-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
}

.status-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
}

.status-toggle-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.status-toggle-btn.make-unavailable {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.status-toggle-btn.make-unavailable:hover:not(:disabled) {
  background-color: #fde68a;
  border-color: #f59e0b;
}

.status-toggle-btn.make-available {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #34d399;
}

.status-toggle-btn.make-available:hover:not(:disabled) {
  background-color: #a7f3d0;
  border-color: #10b981;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
