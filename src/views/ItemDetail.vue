<template>
  <AppLayout>
  <div class="item-detail-container">
    <header class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15l-5-5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Kembali
        </button>
        <div class="header-actions">
          <button class="btn-secondary" @click="toggleEditMode">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ editMode ? 'Batal Edit' : 'Edit Produk' }}
          </button>
          <button class="btn-danger" @click="deleteItem">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" fill="currentColor"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" stroke="currentColor" stroke-width="1"/>
            </svg>
            Hapus
          </button>
        </div>
      </div>
    </header>

    <div class="detail-content" v-if="item">
      <div class="detail-grid">
        <!-- Image Section -->
        <div class="image-section">
          <div class="main-image">
            <img :src="currentImage" :alt="getImageAlt(item)" />
            <div class="image-badge" :class="getStockBadgeClass(item.is_available)">
              {{ getStockBadgeText(item.is_available) }}
            </div>
          </div>
          <div class="image-thumbnails" v-if="item.images && item.images.length > 1">
            <button 
              v-for="(image, index) in item.images" 
              :key="index"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="selectImage(index)"
            >
              <img :src="getImageSrc({ image_url: image }) || image" :alt="`${getImageAlt(item)} ${index + 1}`" />
            </button>
          </div>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <div class="item-header">
            <div v-if="!editMode">
              <h1>{{ item.item_name || item.name }}</h1>
              <span class="item-category">{{ item.item_type || item.category }}</span>
            </div>
            <div v-else class="edit-header">
              <input v-model="editData.item_name" class="edit-title" placeholder="Nama produk" />
              <select v-model="editData.item_type" class="edit-category">
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div class="price-section">
            <div v-if="!editMode">
              <span class="price-label">Harga</span>
              <div class="price-value">Rp {{ formatPrice(item.price) }}</div>
            </div>
            <div v-else class="edit-price">
              <label>Harga</label>
              <input 
                type="number" 
                v-model="editData.price" 
                class="price-input"
                placeholder="Harga produk"
              />
            </div>
          </div>

          <div class="description-section">
            <h3>Deskripsi Produk</h3>
            <div v-if="!editMode">
              <p>{{ item.description }}</p>
            </div>
            <div v-else>
              <textarea 
                v-model="editData.description" 
                class="edit-description"
                placeholder="Deskripsi produk"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div class="specs-section">
            <h3>Informasi Produk</h3>
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-label">Kode Produk</span>
                <span class="spec-value">{{ item.id_item || item.code || `PRD${item.id?.toString().padStart(4, '0') || '0000'}` }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Kategori</span>
                <span class="spec-value">{{ item.item_type || item.category }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Status</span>
                <span class="status-badge" :class="getStatusClass(item.is_available)">
                  {{ getStatusText(item.is_available) }}
                </span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Ditambahkan</span>
                <span class="spec-value">{{ formatDate(item.created_at) }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Terakhir Update</span>
                <span class="spec-value">{{ formatDate(item.updated_at) }}</span>
              </div>
            </div>
          </div>

          <div class="actions-section" v-if="editMode">
            <button class="btn-primary" @click="saveChanges">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
              </svg>
              Simpan Perubahan
            </button>
            <button class="btn-secondary" @click="cancelEdit">
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- Sales History Section -->
      <div class="history-section">
        <h3>Riwayat Penjualan</h3>
        <div class="history-stats">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h4>Total Terjual</h4>
              <p class="stat-value">{{ item.totalSold || 0 }} unit</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h4>Revenue</h4>
              <p class="stat-value">Rp {{ formatPrice((item.totalSold || 0) * item.price) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h4>Rata-rata per Hari</h4>
              <p class="stat-value">{{ Math.round((item.totalSold || 0) / 30) }} unit</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Memuat data produk...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h3>Produk Tidak Ditemukan</h3>
      <p>Produk yang Anda cari tidak dapat ditemukan.</p>
      <button class="btn-primary" @click="goBack">Kembali ke Daftar Produk</button>
    </div>
  </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useItems } from '../composables/useItems.js'
import { getImageSrc, getImageAlt } from '../utils/imageUtils.js'

const route = useRoute()
const router = useRouter()

// Use the items composable
const { 
  loading, 
  error, 
  items, 
  loadItems,
  updateItem, 
  deleteItem: deleteItemFromService,
  clearError 
} = useItems()

// Reactive data
const item = ref(null)
const editMode = ref(false)
const currentImageIndex = ref(0)

const editData = ref({
  item_name: '',
  item_type: '',
  price: 0,
  description: '',
  is_available: true
})

// Computed properties
const currentImage = computed(() => {
  const imageUrl = getImageSrc(item.value)
  return imageUrl || 'https://via.placeholder.com/600x400/64748b/ffffff?text=No+Image'
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Tidak tersedia'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const getStockBadgeClass = (isAvailable) => {
  return isAvailable ? 'badge-success' : 'badge-danger'
}

const getStockBadgeText = (isAvailable) => {
  return isAvailable ? 'Tersedia' : 'Tidak Tersedia'
}

const getStatusClass = (isAvailable) => {
  return isAvailable ? 'status-success' : 'status-danger'
}

const getStatusText = (isAvailable) => {
  return isAvailable ? 'Tersedia' : 'Tidak Tersedia'
}

const goBack = () => {
  router.push('/items')
}

const toggleEditMode = () => {
  if (!editMode.value) {
    // Entering edit mode - populate form with current data
    startEdit()
  } else {
    // Exiting edit mode - cancel changes
    cancelEdit()
  }
}

const startEdit = () => {
  if (!item.value) return
  
  editData.value = {
    item_name: item.value.item_name || item.value.name || '',
    item_type: item.value.item_type || '',
    price: item.value.price || 0,
    description: item.value.description || '',
    is_available: item.value.is_available !== false
  }
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  editData.value = {
    item_name: '',
    item_type: '',
    price: 0,
    description: '',
    is_available: true
  }
}

const saveChanges = async () => {
  if (!item.value) return
  
  try {
    const itemId = item.value.id_item || item.value.id
    // Convert editData to the format expected by updateItem
    const updateData = {
      name: editData.value.item_name,
      price: editData.value.price,
      item_type: editData.value.item_type,
      is_available: editData.value.is_available,
      description: editData.value.description
    }
    
    const success = await updateItem(itemId, updateData)
    
    if (success) {
      // Update local item data
      Object.assign(item.value, editData.value)
      editMode.value = false
      alert('Perubahan berhasil disimpan!')
    } else {
      alert('Gagal menyimpan perubahan: ' + error.value)
    }
  } catch (err) {
    console.error('Error saving changes:', err)
    alert('Terjadi kesalahan saat menyimpan perubahan')
  }
}

const deleteItem = async () => {
  if (!item.value) return
  
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    try {
      const itemId = item.value.id_item || item.value.id
      const success = await deleteItemFromService(itemId)
      
      if (success) {
        alert('Produk berhasil dihapus!')
        router.push('/items')
      } else {
        alert('Gagal menghapus produk: ' + error.value)
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      alert('Terjadi kesalahan saat menghapus produk')
    }
  }
}

const loadItem = async () => {
  const itemId = route.params.id
  
  if (!itemId) {
    error.value = true
    return
  }
  
  try {
    // Find item from the items list (assuming it's already loaded)
    // If not found, we might need to load all items first
    const foundItem = items.value.find(item => 
      (item.id_item || item.id) === itemId || 
      item.id === parseInt(itemId)
    )
    
    if (foundItem) {
      item.value = foundItem
    } else {
      // If item not found in current list, try to load all items
      await loadItems()
      const foundAfterLoad = items.value.find(item => 
        (item.id_item || item.id) === itemId || 
        item.id === parseInt(itemId)
      )
      
      if (foundAfterLoad) {
        item.value = foundAfterLoad
      } else {
        error.value = true
      }
    }
  } catch (err) {
    console.error('Error loading item:', err)
    error.value = true
  }
}

onMounted(async () => {
  await loadItem()
})
</script>

<style scoped>
.item-detail-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary, .btn-danger, .btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
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

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 0.75rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
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

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
  padding: 0;
}

.thumbnail:hover {
  border-color: #3b82f6;
}

.thumbnail.active {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.item-header {
  margin-bottom: 2rem;
}

.item-header h1 {
  color: #111827;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.item-category {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.edit-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-title {
  font-size: 2rem;
  font-weight: 700;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.edit-category {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
}

.price-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.price-label {
  display: block;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price-value {
  color: #059669;
  font-size: 2.5rem;
  font-weight: 700;
}

.edit-price {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-price label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.price-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.description-section, .specs-section {
  margin-bottom: 2rem;
}

.description-section h3, .specs-section h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.description-section p {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.edit-description {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

.specs-grid {
  display: grid;
  gap: 1rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
}

.spec-value {
  color: #374151;
  font-weight: 600;
}

.spec-value.low-stock {
  color: #dc2626;
}

.stock-input {
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  width: 100px;
  text-align: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.status-success {
  background: #059669;
}

.status-warning {
  background: #ea580c;
}

.status-danger {
  background: #dc2626;
}

.actions-section {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.history-section {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.history-section h3 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
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

.stat-info h4 {
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

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 1.125rem;
}

.error-icon {
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.error-state p {
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

/* Responsive Design */
@media (max-width: 968px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .detail-content {
    padding: 1rem;
  }
  
  .info-section {
    padding: 1.5rem;
  }
  
  .item-header h1 {
    font-size: 1.5rem;
  }
  
  .price-value {
    font-size: 2rem;
  }
  
  .history-stats {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .header-actions {
    flex-direction: column;
  }
}
</style>
