<template>
  <AppLayout>
    <div class="transaction-container">
      <header class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Transaksi</h1>
            <p>Kelola transaksi penjualan dan buat transaksi baru</p>
          </div>
          <div class="header-actions">
            <RouterLink to="/pos" class="btn-primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
              </svg>
              Buka Kasir
            </RouterLink>
            <button class="btn-secondary" @click="exportTransactions">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" stroke-width="2"/>
              </svg>
              Export Data
            </button>
          </div>
        </div>
      </header>

      <div class="transaction-content">
        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Penjualan Hari Ini</h3>
              <p class="stat-value">Rp {{ formatPrice(todaySales) }}</p>
              <span class="stat-change positive">{{ todayTransactions }} transaksi</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Rata-rata per Transaksi</h3>
              <p class="stat-value">Rp {{ formatPrice(averageTransaction) }}</p>
              <span class="stat-change neutral">Normal</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Trend Penjualan</h3>
              <p class="stat-value">+15%</p>
              <span class="stat-change positive">Dari minggu lalu</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <div class="action-card">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>Mulai Transaksi Baru</h3>
              <p>Buka interface kasir untuk melayani pelanggan</p>
              <RouterLink to="/pos" class="action-btn">
                Buka Kasir
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fill="currentColor"/>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="filter-section">
          <div class="filter-left">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19 19l-4-4m0-7A7 7 0 111 8a7 7 0 0114 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Cari transaksi..."
                class="search-input"
              />
            </div>
          </div>
          <div class="filter-right">
            <select v-model="selectedStatus" class="filter-select">
              <option value="">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            <input 
              type="date" 
              v-model="selectedDate"
              class="filter-select"
            />
            <select v-model="sortBy" class="filter-select">
              <option value="date">Urutkan: Tanggal</option>
              <option value="amount">Urutkan: Jumlah</option>
              <option value="status">Urutkan: Status</option>
            </select>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="transactions-table-container">
          <div class="table-header">
            <h3>Daftar Transaksi</h3>
            <div class="table-actions">
              <button class="btn-secondary" @click="exportTransactions">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M3 17a1 1 0 001 1h12a1 1 0 001-1v-5a1 1 0 10-2 0v4H5v-4a1 1 0 10-2 0v5zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" fill="currentColor"/>
                </svg>
                Export
              </button>
            </div>
          </div>

          <div class="table-wrapper">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Memuat data transaksi...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
              <div class="error-icon">⚠️</div>
              <h3>Gagal memuat data</h3>
              <p>{{ error }}</p>
              <button @click="getAllTransactions()" class="btn-primary">Coba Lagi</button>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && (!transactions || transactions.length === 0)" class="empty-state">
              <div class="empty-icon">📊</div>
              <h3>Belum ada transaksi</h3>
              <p>Transaksi akan muncul di sini setelah ada penjualan</p>
              <RouterLink to="/pos" class="btn-primary">Buat Transaksi Baru</RouterLink>
            </div>

            <!-- Data Table -->
            <table v-else class="transactions-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Tanggal & Waktu</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Kasir</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="table-row">
                  <td>
                    <div class="transaction-id">
                      <span class="id-text">#{{ transaction.id }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="transaction-date">
                      <span class="date">{{ formatDate(transaction.transaction_date) }}</span>
                      <span class="time">{{ formatTime(transaction.transaction_date) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="transaction-items">
                      <span class="items-count">{{ (transaction.transaction_items || []).length }} item</span>
                      <div class="items-preview">
                        <span 
                          v-for="(item, index) in (transaction.transaction_items || []).slice(0, 2)" 
                          :key="index"
                          class="item-name"
                        >
                          {{ item.item?.name || 'Item tidak ditemukan' }}{{ index < Math.min((transaction.transaction_items || []).length - 1, 1) ? ', ' : '' }}
                        </span>
                        <span v-if="(transaction.transaction_items || []).length > 2" class="more-items">
                          +{{ (transaction.transaction_items || []).length - 2 }} lainnya
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="transaction-amount">
                      <span class="amount">Rp {{ formatPrice(transaction.total_amount || 0) }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(transaction.status)">
                      {{ getStatusText(transaction.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="cashier-info">
                      <span class="cashier-name">{{ transaction.user?.username || 'Admin' }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        class="btn-action view" 
                        @click="viewTransaction(transaction)"
                        title="Lihat Detail"
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
                          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" fill="currentColor"/>
                        </svg>
                      </button>
                      <button 
                        class="btn-action print" 
                        @click="printReceipt(transaction)"
                        title="Print Struk"
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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

      <!-- Transaction Detail Modal -->
      <div v-if="selectedTransaction" class="modal-overlay" @click="selectedTransaction = null">
        <div class="modal-content detail-modal" @click.stop>
          <div class="modal-header">
            <h2>Detail Transaksi #{{ selectedTransaction.id }}</h2>
            <button class="close-btn" @click="selectedTransaction = null">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="transaction-info">
              <div class="info-row">
                <span class="label">Tanggal & Waktu:</span>
                <span class="value">{{ formatDate(selectedTransaction.transaction_date) }} - {{ formatTime(selectedTransaction.transaction_date) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span class="status-badge" :class="getStatusClass(selectedTransaction.status)">
                  {{ getStatusText(selectedTransaction.status) }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Kasir:</span>
                <span class="value">{{ selectedTransaction.user?.username || 'Admin' }}</span>
              </div>
              <div class="info-row" v-if="selectedTransaction.buyer_contact">
                <span class="label">Kontak Pembeli:</span>
                <span class="value">{{ selectedTransaction.buyer_contact }}</span>
              </div>
            </div>

            <div class="items-detail">
              <h4>Items yang Dibeli</h4>
              <div class="items-list">
                <div v-for="transactionItem in (selectedTransaction.transaction_items || [])" :key="transactionItem.id" class="item-row">
                  <span class="item-name">{{ transactionItem.item?.name || 'Item tidak ditemukan' }}</span>
                  <span class="item-quantity">{{ transactionItem.quantity }}x</span>
                  <span class="item-price">Rp {{ formatPrice(transactionItem.price) }}</span>
                  <span class="item-total">Rp {{ formatPrice(transactionItem.quantity * transactionItem.price) }}</span>
                </div>
              </div>
            </div>

            <div class="transaction-summary">
              <div class="summary-row">
                <span class="label">Total:</span>
                <span class="value">Rp {{ formatPrice(selectedTransaction.total_amount || 0) }}</span>
              </div>
              <div class="summary-row" v-if="selectedTransaction.payment_method">
                <span class="label">Metode Bayar:</span>
                <span class="value">{{ selectedTransaction.payment_method }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="printReceipt(selectedTransaction)">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" fill="currentColor"/>
              </svg>
              Print Struk
            </button>
            <button class="btn-primary" @click="selectedTransaction = null">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useTransactions } from '../composables/useTransactions.js'

// Use transactions composable
const { 
  transactions, 
  loading, 
  error, 
  getAllTransactions 
} = useTransactions()

// Reactive data
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedDate = ref('')
const sortBy = ref('date')
const currentPage = ref(1)
const transactionsPerPage = 10
const selectedTransaction = ref(null)

// Load transactions on component mount
onMounted(async () => {
  await getAllTransactions()
})

// Transactions data now comes from API via useTransactions composable

// Computed properties
const filteredTransactions = computed(() => {
  if (!transactions.value || !Array.isArray(transactions.value)) {
    return []
  }
  
  let filtered = transactions.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(transaction => 
      transaction.id?.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.buyer_contact?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (transaction.transaction_items && transaction.transaction_items.some(item => 
        item.item?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
      ))
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(transaction => transaction.status === selectedStatus.value)
  }

  // Filter by date
  if (selectedDate.value) {
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_date)
      const selectedDateObj = new Date(selectedDate.value)
      return transactionDate.toDateString() === selectedDateObj.toDateString()
    })
  }

  // Sort transactions
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'amount':
        return (b.total_amount || 0) - (a.total_amount || 0)
      case 'status':
        return (a.status || '').localeCompare(b.status || '')
      default:
        return new Date(b.transaction_date || 0) - new Date(a.transaction_date || 0)
    }
  })

  return filtered
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * transactionsPerPage
  const end = start + transactionsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / transactionsPerPage)
})

const todaySales = computed(() => {
  if (!transactions.value || !Array.isArray(transactions.value)) return 0
  
  const today = new Date().toDateString()
  return transactions.value
    .filter(t => {
      const transactionDate = new Date(t.transaction_date).toDateString()
      return transactionDate === today && t.status === 'completed'
    })
    .reduce((sum, t) => sum + (t.total_amount || 0), 0)
})

const todayTransactions = computed(() => {
  if (!transactions.value || !Array.isArray(transactions.value)) return 0
  
  const today = new Date().toDateString()
  return transactions.value
    .filter(t => {
      const transactionDate = new Date(t.transaction_date).toDateString()
      return transactionDate === today && t.status === 'completed'
    })
    .length
})

const averageTransaction = computed(() => {
  if (!transactions.value || !Array.isArray(transactions.value)) return 0
  
  const completedTransactions = transactions.value.filter(t => t.status === 'completed')
  if (completedTransactions.length === 0) return 0
  const total = completedTransactions.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  return Math.round(total / completedTransactions.length)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'status-success'
    case 'pending':
      return 'status-warning'
    case 'cancelled':
      return 'status-danger'
    default:
      return 'status-neutral'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Selesai'
    case 'pending':
      return 'Pending'
    case 'cancelled':
      return 'Dibatalkan'
    default:
      return status
  }
}

const exportTransactions = () => {
  console.log('Exporting transaction data...')
  alert('Fitur export data akan segera tersedia!')
}

const viewTransaction = (transaction) => {
  selectedTransaction.value = transaction
}

const printReceipt = (transaction) => {
  console.log('Printing receipt for transaction:', transaction.id)
  alert(`Print struk untuk transaksi ${transaction.id}`)
}



onMounted(() => {
  // Set today's date as default
  selectedDate.value = new Date().toISOString().split('T')[0]
})
</script>

<style scoped>
.transaction-container {
  background: #f8fafc;
}

.page-header {
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
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.transaction-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  margin: 0 0 0.25rem 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #059669;
}

.stat-change.neutral {
  color: #64748b;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-left, .filter-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
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

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  min-width: 140px;
}

.transactions-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.table-wrapper {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.transactions-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:hover {
  background: #f8fafc;
}

.transaction-id .id-text {
  font-weight: 600;
  color: #1e40af;
}

.transaction-date {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date {
  font-weight: 500;
  color: #374151;
}

.time {
  font-size: 0.875rem;
  color: #64748b;
}

.transaction-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.items-count {
  font-weight: 500;
  color: #374151;
}

.items-preview {
  font-size: 0.875rem;
  color: #64748b;
}

.more-items {
  font-style: italic;
  color: #94a3b8;
}

.transaction-amount .amount {
  font-weight: 600;
  color: #059669;
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

.status-neutral {
  background: #64748b;
}

.cashier-info .cashier-name {
  color: #374151;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-action.view {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-action.view:hover {
  background: #bfdbfe;
}

.btn-action.print {
  background: #dcfce7;
  color: #059669;
}

.btn-action.print:hover {
  background: #bbf7d0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: #f8fafc;
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
  border-radius: 0.75rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px 0 rgba(0, 0, 0, 0.15);
}

.transaction-modal {
  max-width: 500px;
}

.detail-modal {
  max-width: 700px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: #111827;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: #64748b;
}

.transaction-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-row .label {
  font-weight: 500;
  color: #64748b;
}

.info-row .value {
  color: #374151;
  font-weight: 600;
}

.items-detail h4 {
  margin: 0 0 1rem 0;
  color: #111827;
  font-weight: 600;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr auto auto auto;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}

.item-name {
  color: #374151;
  font-weight: 500;
}

.item-quantity, .item-price, .item-total {
  text-align: right;
  color: #64748b;
}

.item-total {
  font-weight: 600;
  color: #374151;
}

.transaction-summary {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-row.total {
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-weight: 700;
  font-size: 1.125rem;
}

.summary-row .label {
  color: #64748b;
}

.summary-row .value {
  color: #374151;
  font-weight: 600;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 2rem;
}

.action-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 0.75rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.action-content {
  flex: 1;
}

.action-content h3 {
  color: #1e40af;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.action-content p {
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.action-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.49);
}

/* Loading, Error, and Empty States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3,
.empty-state h3 {
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-state p,
.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.loading-state p {
  color: #6b7280;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .transaction-content {
    padding: 1rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-left, .filter-right {
    flex-direction: column;
  }

  .search-box {
    min-width: auto;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .action-icon {
    width: 3rem;
    height: 3rem;
    align-self: center;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .transactions-table {
    min-width: 800px;
  }

  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
