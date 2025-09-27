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
          <button @click="showAddModal = true" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Tambah Produk
          </button>
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
            <img 
              :src="getItemImageSrc(item)" 
              :alt="item.item_name || item.name"
              @error="handleImageError"
              loading="lazy"
            />
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

    <!-- Add Item Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content add-item-modal" @click.stop>
        <div class="modal-header">
          <h2>Tambah Produk Baru</h2>
          <button class="close-btn" @click="closeAddModal">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateItem" class="add-item-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="item_name">Nama Produk *</label>
              <input
                id="item_name"
                v-model="form.item_name"
                type="text"
                class="form-input"
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="item_type">Kategori</label>
              <select
                id="item_type"
                v-model="form.item_type"
                class="form-input"
              >
                <option value="">Pilih Kategori</option>
                <option value="food">Makanan</option>
                <option value="beverage">Minuman</option>
                <option value="snack">Snack</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="price">Harga *</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="is_available">Status</label>
              <select
                id="is_available"
                v-model="form.is_available"
                class="form-input"
              >
                <option :value="true">Tersedia</option>
                <option :value="false">Tidak Tersedia</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label" for="description">Deskripsi</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-textarea"
                rows="3"
                placeholder="Deskripsi produk (opsional)"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Gambar Produk</label>
              
              <!-- Image Upload Options -->
              <div class="image-upload-section">
                <div class="upload-tabs">
                  <button 
                    type="button"
                    @click="uploadMethod = 'file'"
                    :class="['upload-tab', uploadMethod === 'file' ? 'active' : '']"
                  >
                    Upload File
                  </button>
                  <button 
                    type="button"
                    @click="uploadMethod = 'url'"
                    :class="['upload-tab', uploadMethod === 'url' ? 'active' : '']"
                  >
                    URL Gambar
                  </button>
                </div>

                <!-- File Upload -->
                <div v-if="uploadMethod === 'file'" class="upload-content">
                  <!-- Direct File Input (always visible for testing) -->
                  <div class="direct-file-input">
                    <label for="imageFileInput" class="file-input-label" @click.prevent="triggerImageInput">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Pilih File Gambar
                    </label>
                    <input 
                      id="imageFileInput"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      @change="handleDirectFileInput"
                      style="display: none;"
                    />
                  </div>

                  <!-- Upload Area -->
                  <div 
                    class="file-upload-area" 
                    @dragover.prevent="handleDragOver"
                    @dragleave.prevent="handleDragLeave"
                    @drop.prevent="handleDrop"
                    :class="{ 'dragover': isDragOver }"
                  >
                    <div v-if="!selectedFile" class="upload-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      <p>Atau drag & drop gambar di sini</p>
                      <span class="upload-hint">PNG, JPG, GIF, WebP hingga 5MB</span>
                    </div>
                    
                    <div v-else class="image-preview-container">
                      <img :src="imagePreview" alt="Preview" class="image-preview" />
                      <div class="image-info">
                        <p class="file-name">📁 {{ selectedFile?.name }}</p>
                        <p class="file-size">📏 {{ formatFileSize(selectedFile?.size) }}</p>
                        <p v-if="isConverting" class="converting">🔄 Converting to base64...</p>
                        <p v-else class="ready">✅ Ready to upload</p>
                      </div>
                      <button type="button" @click="clearSelectedFile" class="remove-image-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- URL Input -->
                <div v-if="uploadMethod === 'url'" class="upload-content">
                  <input
                    v-model="form.image_url"
                    type="url"
                    class="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Image Upload Status -->
          <div v-if="uploadMethod === 'file'" class="upload-status">
            <div class="status-item">
              <span class="status-label">Upload Method:</span>
              <span class="status-value">{{ uploadMethod }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Image File:</span>
              <span class="status-value" :class="selectedFile ? 'success' : 'warning'">
                {{ selectedFile ? '✅ ' + selectedFile.name : '❌ No file selected' }}
              </span>
            </div>
            <div v-if="selectedFile" class="status-item">
              <span class="status-label">File Size:</span>
              <span class="status-value">{{ Math.round(selectedFile.size / 1024) }} KB</span>
            </div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeAddModal" class="btn-secondary">
              Batal
            </button>
            <!-- Debug Button to Check Form State -->
            <button 
              type="button" 
              @click="debugFormState" 
              class="btn-warning"
              style="margin-right: 8px;"
            >
              Debug Form
            </button>
            <!-- Test Button for Base64 Conversion -->
            <button 
              v-if="selectedFile" 
              type="button" 
              @click="testBase64Conversion" 
              class="btn-warning"
              style="margin-right: 8px;"
            >
              Test Base64
            </button>
            <button type="submit" :disabled="isLoading" class="btn-primary">
              <span v-if="isLoading">Menyimpan...</span>
              <span v-else>Simpan Produk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useItems } from '../composables/useItems.js'
import { getImageSrc, getImageAlt, handleImageError } from '../utils/imageUtils'
import imagesService from '../services/imagesService.js'

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

// Using our own simple form instead of useItemForm

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('all')
const loadingItemId = ref(null)
const localSearchQuery = ref('')
const localSelectedCategory = ref('')
const localSortBy = ref('name')
const showAddModal = ref(false)
const isLoading = ref(false)

// Simple form object for new items
const form = ref({
  item_name: '',
  item_type: '',
  price: 0,
  description: '',
  is_available: true,
  image_base64: null,
  image_type: null
})

const uploadMethod = ref('file') // 'file' or 'url'
const imageInput = ref(null) // File input reference
const isDragOver = ref(false) // Drag and drop state
const selectedFile = ref(null) // Currently selected file
const imagePreview = ref(null) // Image preview URL
const isConverting = ref(false) // Base64 conversion status

// Pagination data
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Total pages computed
const totalPages = computed(() => {
  return Math.ceil(displayItems.value.length / itemsPerPage.value)
})

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

// Image URL cache for efficient loading
const imageUrlCache = ref(new Map())

// Function to get image URL from filename or image ID (async version)
const getItemImageUrl = async (item) => {
  try {
    const itemId = item.id_item || item.id
    
    // If item has direct image_url, use it with base URL if it's a relative path
    if (item.image_url) {
      if (item.image_url.startsWith('http')) {
        console.log(`🖼️ [Item ${itemId}] Async - Using direct image_url: ${item.image_url}`)
        return item.image_url
      }
      const baseUrl = getBaseUrl()
      const fullUrl = `${baseUrl}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`
      console.log(`🖼️ [Item ${itemId}] Async - Constructed URL from image_url: ${fullUrl}`)
      return fullUrl
    }
    
    // If item has image filename, try to get URL from images service
    if (item.image) {
      // Check cache first
      const cacheKey = item.image
      if (imageUrlCache.value.has(cacheKey)) {
        const cachedUrl = imageUrlCache.value.get(cacheKey)
        console.log(`🖼️ [Item ${itemId}] Async - Using cached URL for ${item.image}: ${cachedUrl}`)
        return cachedUrl
      }
      
      // Generate image URL using the service (which now uses correct API endpoint)
      const imageUrl = imagesService.getImageUrl(item.image)
      
      // Cache the result
      imageUrlCache.value.set(cacheKey, imageUrl)
      
      console.log(`🖼️ [Item ${itemId}] Async - Generated and cached URL for ${item.image}: ${imageUrl}`)
      return imageUrl
    }
    
    // If item has image_filename field
    if (item.image_filename) {
      const cacheKey = item.image_filename
      if (imageUrlCache.value.has(cacheKey)) {
        const cachedUrl = imageUrlCache.value.get(cacheKey)
        console.log(`🖼️ [Item ${itemId}] Async - Using cached URL for ${item.image_filename}: ${cachedUrl}`)
        return cachedUrl
      }
      
      const imageUrl = imagesService.getImageUrl(item.image_filename)
      imageUrlCache.value.set(cacheKey, imageUrl)
      
      console.log(`🖼️ [Item ${itemId}] Async - Generated and cached URL for ${item.image_filename}: ${imageUrl}`)
      return imageUrl
    }
    
    // Default placeholder
    console.log(`🖼️ [Item ${itemId}] Async - Using default placeholder - no image data found`)
    return 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=No+Image'
    
  } catch (error) {
    console.error('Failed to get image URL for item:', item.id_item || item.id, error)
    return 'https://via.placeholder.com/200x150/ff6b6b/ffffff?text=Error'
  }
}

// Reactive image URLs for items
const itemImageUrls = ref(new Map())

// Get image base URL from environment variable
const getBaseUrl = () => {
  return import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000/api/images'
}

// Synchronous function to get image src for template (with caching)
const getItemImageSrc = (item) => {
  const itemId = item.id_item || item.id
  
  // If item has direct image_url, use it with base URL if it's a relative path
  if (item.image_url) {
    if (item.image_url.startsWith('http')) {
      console.log(`🖼️ [Item ${itemId}] Using direct image_url: ${item.image_url}`)
      return item.image_url
    }
    const baseUrl = getBaseUrl()
    const fullUrl = `${baseUrl}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`
    console.log(`🖼️ [Item ${itemId}] Constructed URL from image_url: ${fullUrl}`)
    return fullUrl
  }
  
  // If item has image filename, construct URL from images service
  if (item.image) {
    const imageUrl = imagesService.getImageUrl(item.image)
    console.log(`🖼️ [Item ${itemId}] Generated URL from image filename (${item.image}): ${imageUrl}`)
    return imageUrl
  }
  
  // If item has image_filename field
  if (item.image_filename) {
    const imageUrl = imagesService.getImageUrl(item.image_filename)
    console.log(`🖼️ [Item ${itemId}] Generated URL from image_filename (${item.image_filename}): ${imageUrl}`)
    return imageUrl
  }
  
  // Default placeholder
  console.log(`🖼️ [Item ${itemId}] Using default placeholder - no image data found`)
  return 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=No+Image'
}

// Handle image load errors
const handleImageLoadError = (event, item) => {
  console.warn('Failed to load image for item:', item.id_item, event.target.src)
  event.target.src = 'https://via.placeholder.com/200x150/ff6b6b/ffffff?text=Error'
}

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

// Add Item Methods
const closeAddModal = () => {
  showAddModal.value = false
  
  // Reset form
  form.value = {
    item_name: '',
    item_type: '',
    price: 0,
    description: '',
    is_available: true,
    image_base64: null,
    image_type: null
  }
  
  // Clear file selection if function exists
  if (typeof clearSelectedFile === 'function') {
    clearSelectedFile()
  }
  
  // Clear error if function exists
  if (typeof clearError === 'function') {
    clearError()
  }
}

const handleCreateItem = async () => {
  try {
    console.log('=== CREATING ITEM ===')
    console.log('Form data:', form)
    
    // Validate form
    console.log('🔍 VALIDATING FORM...')
    console.log('Form values:', form.value)
    
    if (!form.value.item_name.trim()) {
      error.value = 'Nama item harus diisi'
      return
    }
    
    if (!form.value.price || form.value.price <= 0) {
      error.value = 'Harga harus lebih dari 0'
      return
    }
    
    console.log('✅ Form validation passed')

    isLoading.value = true
    error.value = null

    // Create item data following API spec
    const itemData = {
      item_name: form.value.item_name.trim(),
      item_type: form.value.item_type?.trim() || null,
      price: parseFloat(form.value.price),
      is_available: form.value.is_available !== false,
      description: form.value.description?.trim() || null
    }
    
    // Log the item data for debugging
    console.log('📋 ITEM DATA PAYLOAD:')
    console.log('- item_name:', itemData.item_name)
    console.log('- item_type:', itemData.item_type)
    console.log('- price:', itemData.price)
    console.log('- is_available:', itemData.is_available)
    console.log('- description:', itemData.description)

    // Add base64 image if available
    if (form.value.image_base64 && form.value.image_type) {
      itemData.image_base64 = form.value.image_base64
      itemData.image_type = form.value.image_type
      
      console.log('Adding base64 image to payload:', {
        image_type: itemData.image_type,
        data_length: itemData.image_base64.length
      })
    }

    console.log('📤 FINAL API PAYLOAD:')
    console.log('===================')
    console.log('Complete payload:', {
      ...itemData,
      image_base64: itemData.image_base64 ? `[${itemData.image_base64.length} chars]` : undefined
    })
    console.log('Raw payload for API:')
    console.log(JSON.stringify(itemData, null, 2))
    console.log('===================')
    
    if (itemData.image_url) {
      console.log('  - image_url:', itemData.image_url, '(string, optional)')
    }
    
    // Image base64 validation
    if (itemData.image_base64) {
      console.log('🖼️ BASE64 IMAGE FIELDS:')
      console.log('  - image_base64: [' + itemData.image_base64.length + ' chars] (string, optional)')
      console.log('  - image_type:', itemData.image_type, '(MIME type, required when image_base64 provided)')
      
      // Validate base64 format
      const hasDataPrefix = itemData.image_base64.startsWith('data:')
      console.log('  - Base64 format check:', hasDataPrefix ? '❌ Has data: prefix (should be removed)' : '✅ Clean base64 data')
      
      // Validate MIME type format
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const isMimeValid = validMimeTypes.includes(itemData.image_type)
      console.log('  - MIME type validation:', isMimeValid ? '✅ Valid MIME type' : '❌ Invalid MIME type')
    }
    
    console.log('')
    console.log('� FINAL PAYLOAD (matches API spec exactly):')
    console.log(JSON.stringify({
      ...itemData,
      image_base64: itemData.image_base64 ? `[${itemData.image_base64.length} base64 chars]` : undefined
    }, null, 2))
    console.log('=====================================')
    console.log('')

    const success = await createItem(itemData)
    
    if (success) {
      console.log('✅ Item created successfully!')
      closeAddModal()
      await loadItems()
    }
    
  } catch (err) {
    console.error('❌ Create item error:', err)
    error.value = 'Terjadi kesalahan: ' + err.message
  } finally {
    isLoading.value = false
  }
}

// Simple file input handler
const handleDirectFileInput = async (event) => {
  const file = event.target.files[0]
  console.log('� DIRECT FILE INPUT')
  console.log('Selected file:', file)
  
  if (file) {
    await processSelectedFile(file)
  }
}

// Programmatically trigger the hidden file input (reliable on some browsers)
const triggerImageInput = () => {
  const el = document.getElementById('imageFileInput')
  if (el) el.click()
}

// Simple modal functions - no complex logic
const openAddModal = () => {
  showAddModal.value = true
}

// Clear selected file function
const clearSelectedFile = () => {
  selectedFile.value = null
  imagePreview.value = null
  isConverting.value = false
  
  // Clear form image data
  form.value.image_base64 = null
  form.value.image_type = null
  
  // Clear file input
  const fileInput = document.getElementById('imageFileInput')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Validate image file
const validateImageFile = (file) => {
  const errors = []
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP')
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('Ukuran file terlalu besar. Maksimal 5MB')
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  }
}

// Process selected file (from input or drag&drop)
const processSelectedFile = async (file) => {
  console.log('🔄 PROCESSING FILE:', file.name)
  
  // Validate file using images service
  const validation = imagesService.validateImageFile(file)
  if (!validation.isValid) {
    console.error('❌ Validation failed:', validation.errors)
    error.value = validation.errors.join(', ')
    return
  }
  
  // Clear previous errors
  error.value = null
  
  // Set file and start conversion
  selectedFile.value = file
  isConverting.value = true
  
  try {
    // Create preview URL
    imagePreview.value = URL.createObjectURL(file)
    
    // Convert to base64
    console.log('� Converting to base64...')
    const imageData = await convertFileToBase64(file)
    
    // Update form with image data
    form.value.image_base64 = imageData.data_base64
    form.value.image_type = imageData.content_type
    
    console.log('✅ File processed successfully!')
    console.log('Base64 length:', imageData.data_base64.length)
    console.log('Content type:', imageData.content_type)
    
  } catch (err) {
    console.error('❌ Failed to process file:', err)
    error.value = 'Gagal memproses file: ' + err.message
    clearSelectedFile()
  } finally {
    isConverting.value = false
  }
}

// Removed duplicate clearSelectedFile function

// Base64 conversion function
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      try {
        const result = reader.result
        // Remove data URI prefix (data:image/png;base64,)
        const base64Data = result.split(',')[1]
        
        resolve({
          data_base64: base64Data,
          content_type: file.type,
          file_size: file.size,
          file_name: file.name
        })
      } catch (error) {
        reject(new Error('Failed to process base64 data'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Drag and drop handlers
const handleDragOver = (event) => {
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  isDragOver.value = false
}

const handleDrop = async (event) => {
  console.log('📁 DROP EVENT')
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    await processSelectedFile(file)
  }
}

// Format file size helper
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Removed old handleImageUpload function - using handleDirectFileInput instead

// Debug form state
const debugFormState = () => {
  console.log('🔧 FORM STATE DEBUG')
  console.log('==================')
  console.log('📋 Complete form data:')
  console.log(JSON.stringify(form.value, null, 2))
  console.log('')
  console.log('🖼️ Image-specific fields:')
  console.log('  - selectedFile:', selectedFile.value)
  console.log('  - imagePreview:', imagePreview.value)
  console.log('  - image_base64 length:', form.value.image_base64?.length || 0)
  console.log('  - image_type:', form.value.image_type)
  console.log('  - Upload method:', uploadMethod.value)
  console.log('')
  console.log('⚙️ Functions available:')
  console.log('  - setImageFile:', typeof setImageFile)
  console.log('  - removeImage:', typeof removeImage) 
  console.log('  - getImageBase64:', typeof getImageBase64)
  console.log('')
  console.log('🧪 Testing file input elements...')
  const fileInput = document.querySelector('input[type="file"]')
  console.log('  - File input element:', fileInput)
  console.log('  - File input files:', fileInput?.files)
  console.log('  - imageInput ref:', imageInput.value)
  console.log('  - Click event test:')
  if (fileInput) {
    console.log('    - Element exists: ✅')
    console.log('    - Element visible:', getComputedStyle(fileInput).display !== 'none')
    console.log('    - Element disabled:', fileInput.disabled)
  }
  console.log('==================')
}

// Test base64 conversion and show payload
const testBase64Conversion = async () => {
  if (selectedFile.value && form.value.image_base64) {
    try {
      console.log('Testing base64 conversion...')
      console.log('Base64 conversion result:', {
        content_type: form.value.image_type,
        data_length: form.value.image_base64?.length,
        file_name: selectedFile.value.name
      })
      
      // Show what the actual API payload would look like
      const testPayload = {
        item_name: form.value.item_name || 'Test Item',
        item_type: form.value.item_type || 'test',
        price: parseFloat(form.value.price) || 99.99,
        is_available: true,
        description: form.value.description || 'Test description',
        image_base64: form.value.image_base64,
        image_type: form.value.image_type
      }
      
      console.log('🧪 TEST PAYLOAD (what would be sent to API):')
      console.log(JSON.stringify({
        ...testPayload,
        image_base64: `[${testPayload.image_base64.length} base64 chars]`
      }, null, 2))
      
      console.log('🔍 ACTUAL BASE64 PREVIEW (first 100 chars):')
      console.log(testPayload.image_base64.substring(0, 100) + '...')
      
    } catch (err) {
      console.error('Base64 conversion test failed:', err)
    }
  } else {
    console.log('No image file selected for base64 test')
  }
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
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
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

.btn-warning {
  padding: 0.75rem 1.5rem;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.upload-status {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-weight: 500;
  color: #374151;
}

.status-value {
  color: #6b7280;
}

.status-value.success {
  color: #059669;
  font-weight: 500;
}

.status-value.warning {
  color: #d97706;
  font-weight: 500;
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
  box-shadow: 0 20px 25px 0 rgba(0, 0, 0, 0.15);
}

.add-item-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.error-text {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #dc2626;
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

.add-item-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Form Styles */
.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
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
/* Image Upload Styles */
.upload-tabs {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 20px;
}

.upload-tab {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  transition: all 0.2s;
}

.upload-tab.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.upload-tab:hover {
  color: #007bff;
}

.file-upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.2s;
  cursor: pointer;
}

.file-upload-area:hover {
  border-color: #007bff;
  background: #e3f2fd;
}

.file-upload-area.dragover {
  border-color: #007bff;
  background: #e3f2fd;
}

.upload-icon {
  font-size: 48px;
  color: #6c757d;
  margin-bottom: 16px;
}

.upload-text {
  color: #6c757d;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.file-input {
  display: none;
}

.image-preview-container {
  margin-top: 16px;
  position: relative;
}

.image-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.remove-image-btn:hover {
  background: #c82333;
}

.direct-file-input {
  display: block;
  margin-bottom: 8px;
}

.file-input-label {
  display: inline-block;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.file-input-label:hover {
  background: #0056b3;
}

.image-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
  border: 1px solid #e9ecef;
}

.image-info .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.image-info .info-row:last-child {
  margin-bottom: 0;
}

.image-info .label {
  font-weight: 500;
  color: #495057;
}

.image-info .value {
  color: #6c757d;
}

/* Existing styles remain the same */
</style>
