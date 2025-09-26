<template>
  <AppLayout>
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Dashboard</h1>
            <p>Selamat datang kembali, Admin!</p>
          </div>
          <div class="header-actions">
            <RouterLink to="/pos" class="btn-primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
              </svg>
              Buka Kasir
            </RouterLink>
            <RouterLink to="/items" class="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" fill="currentColor"/>
              </svg>
              Kelola Produk
            </RouterLink>
          </div>
        </div>
      </header>

    <main class="dashboard-main">
      <div class="dashboard-content">
        <div class="welcome-card">
          <h1>Selamat Datang di Dashboard KasirApp</h1>
          <p>Sistem kasir modern untuk bisnis Anda</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading || reportsLoading || transactionsLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat data dashboard...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="reportsError || transactionsError" class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Gagal memuat data</h3>
          <p>{{ reportsError || transactionsError }}</p>
          <button @click="loadDashboardData()" class="btn-retry">Coba Lagi</button>
        </div>

        <!-- Statistics -->
        <div v-else class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Penjualan Hari Ini</h3>
              <p class="stat-value">Rp {{ formatCurrency(todayStats.totalSales) }}</p>
              <span class="stat-change" :class="getGrowthClass(growthStats.salesGrowth)">
                {{ formatPercentage(growthStats.salesGrowth) }} dari kemarin
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Total Transaksi</h3>
              <p class="stat-value">{{ todayStats.totalTransactions }}</p>
              <span class="stat-change" :class="getGrowthClass(growthStats.transactionGrowth)">
                {{ formatPercentage(growthStats.transactionGrowth) }} dari kemarin
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Rata-rata per Transaksi</h3>
              <p class="stat-value">Rp {{ formatCurrency(todayStats.averageOrderValue) }}</p>
              <span class="stat-change neutral">
                {{ todayStats.totalTransactions > 0 ? 'Normal' : 'Belum ada transaksi' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Top Items Today (if available) -->
        <div v-if="todayReport && todayReport.top_items && todayReport.top_items.length > 0" class="top-items-section">
          <h2>Produk Terlaris Hari Ini</h2>
          <div class="top-items-grid">
            <div 
              v-for="(item, index) in todayReport.top_items.slice(0, 3)" 
              :key="item.id_item" 
              class="top-item-card"
            >
              <div class="item-rank">{{ index + 1 }}</div>
              <div class="item-info">
                <h4>{{ item.item_name }}</h4>
                <div class="item-stats">
                  <span class="quantity">Terjual: {{ item.quantity_sold }}</span>
                  <span class="revenue">Rp {{ formatCurrency(item.revenue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Aksi Cepat</h2>
          <div class="actions-grid">
            <div class="action-card">
              <div class="action-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Buka Kasir</h3>
              <p>Mulai transaksi baru dan layani pelanggan</p>
              <RouterLink to="/pos" class="action-btn primary">Mulai</RouterLink>
            </div>

            <div class="action-card">
              <div class="action-icon secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Kelola Produk</h3>
              <p>Tambah, edit, atau lihat daftar produk</p>
              <RouterLink to="/items" class="action-btn secondary">Kelola</RouterLink>
            </div>

            <div class="action-card">
              <div class="action-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <h3>Lihat Transaksi</h3>
              <p>Riwayat dan detail transaksi penjualan</p>
              <RouterLink to="/transactions" class="action-btn success">Lihat</RouterLink>
            </div>

            <div class="action-card">
              <div class="action-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <h3>Laporan</h3>
              <p>Analisis penjualan dan performa bisnis</p>
              <RouterLink to="/reports" class="action-btn warning">Lihat</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useReports } from '../composables/useReports'
import { useTransactions } from '../composables/useTransactions'

const router = useRouter()

// Use composables for data
const { todayReport, loading: reportsLoading, error: reportsError, loadTodayReport } = useReports()
const { transactions, loading: transactionsLoading, error: transactionsError, getAllTransactions } = useTransactions()

// Loading state
const loading = ref(false)

// Computed statistics
const todayStats = computed(() => {
  console.log('Computing todayStats, todayReport.value:', todayReport.value)
  
  if (!todayReport.value) {
    console.log('No todayReport data, returning zeros')
    return {
      totalSales: 0,
      totalTransactions: 0,
      totalProductsSold: 0,
      averageOrderValue: 0
    }
  }

  const stats = {
    totalSales: todayReport.value.sum_total_price || 0,
    totalTransactions: todayReport.value.total_transactions || 0,
    totalProductsSold: todayReport.value.total_products_sold || 0,
    averageOrderValue: todayReport.value.average_order_value || 0
  }
  
  console.log('Computed todayStats:', stats)
  return stats
})

// Growth calculations (comparing with yesterday - for demo purposes)
const growthStats = computed(() => {
  // For demo purposes, we'll calculate some growth percentages
  const salesGrowth = Math.floor(Math.random() * 20) - 5 // -5% to +15%
  const transactionGrowth = Math.floor(Math.random() * 15) - 3 // -3% to +12%
  
  return {
    salesGrowth,
    transactionGrowth,
    productsGrowth: Math.floor(Math.random() * 10) - 2 // -2% to +8%
  }
})

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount || 0)
}

// Format percentage
const formatPercentage = (percentage) => {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage}%`
}

// Get growth class
const getGrowthClass = (percentage) => {
  if (percentage > 0) return 'positive'
  if (percentage < 0) return 'negative'
  return 'neutral'
}

// Load dashboard data
const loadDashboardData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadTodayReport(),
      getAllTransactions()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Initialize dashboard
onMounted(async () => {
  await loadDashboardData()
})

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  background: #f8fafc;
}

.dashboard-header {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-primary {
  display: flex;
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

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
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
  transform: translateY(-1px);
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-card h1 {
  color: #1e40af;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.welcome-card p {
  color: #64748b;
  margin: 0;
  font-size: 1.125rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
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
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  margin: 0 0 0.25rem 0;
  color: #111827;
  font-size: 1.875rem;
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

.stat-change.negative {
  color: #dc2626;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
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

.loading-state p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #dc2626;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn-retry {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retry:hover {
  background: #2563eb;
}

/* Top Items Section */
.top-items-section {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.top-items-section h2 {
  color: #1e40af;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.top-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.top-item-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
  transition: all 0.2s;
}

.top-item-card:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.item-rank {
  width: 1.75rem;
  height: 1.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-stats {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.quantity {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 500;
}

.revenue {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Quick Actions */
.quick-actions {
  margin-top: 2rem;
}

.quick-actions h2 {
  color: #1e40af;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.action-icon.primary {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.action-icon.secondary {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
}

.action-icon.success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #059669;
}

.action-icon.warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.action-card h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
}

.action-card p {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  min-width: 80px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #475569;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.action-btn.success {
  background: #059669;
  color: white;
}

.action-btn.success:hover {
  background: #047857;
}

.action-btn.warning {
  background: #d97706;
  color: white;
}

.action-btn.warning:hover {
  background: #b45309;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-card h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .top-items-grid {
    grid-template-columns: 1fr;
  }

  .top-item-card {
    flex-direction: column;
    text-align: center;
  }

  .item-info h4 {
    white-space: normal;
  }
}
</style>
