<template>
  <AppLayout>
    <div class="reports-container">
      <h1 class="reports-title">Laporan</h1>

      <!-- Tab Navigation -->
      <div class="tabs-container">
        <nav class="tabs-nav">
          <button 
            @click="activeTab = 'today'" 
            :class="['tab-button', activeTab === 'today' ? 'tab-active' : '']"
          >
            Laporan Hari Ini
          </button>
          <button 
            @click="activeTab = 'monthly'" 
            :class="['tab-button', activeTab === 'monthly' ? 'tab-active' : '']"
          >
            Laporan Bulanan
          </button>
          <button 
            @click="activeTab = 'daily'" 
            :class="['tab-button', activeTab === 'daily' ? 'tab-active' : '']"
          >
            Laporan Harian
          </button>
        </nav>
      </div>

      <!-- Today Report -->
      <div v-if="activeTab === 'today'" class="tab-content">
        <div class="section-header">
          <h2 class="section-title">Laporan Hari Ini</h2>
          <button 
            @click="loadTodayReport()" 
            :disabled="loading"
            class="btn btn-primary"
          >
            {{ loading ? 'Memuat...' : 'Muat Data' }}
          </button>
        </div>

        <!-- Today Statistics -->
        <div v-if="todayStats" class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Transaksi</p>
                <p class="stat-value">{{ todayStats.totalTransactions }}</p>
              </div>
              <div class="stat-icon blue">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Pendapatan</p>
                <p class="stat-value green">Rp {{ formatCurrency(todayStats.totalRevenue) }}</p>
              </div>
              <div class="stat-icon green">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Item Terjual</p>
                <p class="stat-value purple">{{ todayStats.totalItemsSold }}</p>
              </div>
              <div class="stat-icon purple">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Today Transactions -->
        <div v-if="todayReport" class="table-container">
          <div class="table-header">
            <div class="table-header-content">
              <h3 class="table-title">Transaksi Hari Ini</h3>
              <button 
                @click="exportToCSV(todayReport.transactions, 'laporan-hari-ini')"
                class="btn btn-success btn-sm"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Waktu</th>
                  <th>Total</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in todayReport.transactions" :key="transaction.id">
                  <td class="transaction-id">
                    #{{ transaction.id }}
                  </td>
                  <td class="transaction-date">
                    {{ formatDateTime(transaction.created_at) }}
                  </td>
                  <td class="transaction-total">
                    Rp {{ formatCurrency(transaction.total) }}
                  </td>
                  <td class="transaction-items">
                    <div v-if="transaction.items && transaction.items.length > 0" class="items-list">
                      <div v-for="item in transaction.items" :key="item.id" class="item-entry">
                        {{ item.name }} ({{ item.quantity }}x)
                      </div>
                    </div>
                    <span v-else class="no-items">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Monthly Report -->
      <div v-if="activeTab === 'monthly'" class="tab-content">
        <div class="filter-container">
          <h2 class="section-title">Filter Laporan Bulanan</h2>
          <div class="filter-grid">
            <div class="form-group">
              <label class="form-label">Bulan</label>
              <select v-model="monthlyFilters.month" class="form-select">
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tahun</label>
              <select v-model="monthlyFilters.year" class="form-select">
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="form-group button-group">
              <button 
                @click="loadMonthlyReport()" 
                :disabled="loading"
                class="btn btn-primary btn-block"
              >
                {{ loading ? 'Memuat...' : 'Tampilkan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Monthly Statistics -->
        <div v-if="monthlyStats" class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Transaksi</p>
                <p class="stat-value">{{ monthlyStats.totalTransactions }}</p>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Pendapatan</p>
                <p class="stat-value green">Rp {{ formatCurrency(monthlyStats.totalRevenue) }}</p>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Item Terjual</p>
                <p class="stat-value purple">{{ monthlyStats.totalItemsSold }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Transactions -->
        <div v-if="monthlyReport" class="table-container">
          <div class="table-header">
            <div class="table-header-content">
              <h3 class="table-title">
                Transaksi {{ getMonthName(monthlyFilters.month) }} {{ monthlyFilters.year }}
              </h3>
              <button 
                @click="exportToCSV(monthlyReport.transactions, `laporan-${monthlyFilters.month}-${monthlyFilters.year}`)"
                class="btn btn-success btn-sm"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in monthlyReport.transactions" :key="transaction.id">
                  <td class="transaction-id">
                    #{{ transaction.id }}
                  </td>
                  <td class="transaction-date">
                    {{ formatDateTime(transaction.created_at) }}
                  </td>
                  <td class="transaction-total">
                    Rp {{ formatCurrency(transaction.total) }}
                  </td>
                  <td class="transaction-items">
                    <div v-if="transaction.items && transaction.items.length > 0" class="items-list">
                      <div v-for="item in transaction.items" :key="item.id" class="item-entry">
                        {{ item.name }} ({{ item.quantity }}x)
                      </div>
                    </div>
                    <span v-else class="no-items">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Daily Report -->
      <div v-if="activeTab === 'daily'" class="tab-content">
        <div class="filter-container">
          <h2 class="section-title">Filter Laporan Harian</h2>
          <div class="filter-grid daily">
            <div class="form-group">
              <label class="form-label">Tanggal</label>
              <input 
                v-model="dailyFilters.date" 
                type="date" 
                class="form-input"
              />
            </div>
            <div class="form-group button-group">
              <button 
                @click="loadDailyReport()" 
                :disabled="loading || !dailyFilters.date"
                class="btn btn-primary btn-block"
              >
                {{ loading ? 'Memuat...' : 'Tampilkan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Daily Statistics -->
        <div v-if="dailyStats" class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Transaksi</p>
                <p class="stat-value">{{ dailyStats.totalTransactions }}</p>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Pendapatan</p>
                <p class="stat-value green">Rp {{ formatCurrency(dailyStats.totalRevenue) }}</p>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Item Terjual</p>
                <p class="stat-value purple">{{ dailyStats.totalItemsSold }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Transactions -->
        <div v-if="dailyReport" class="table-container">
          <div class="table-header">
            <div class="table-header-content">
              <h3 class="table-title">
                Transaksi {{ formatDate(dailyFilters.date) }}
              </h3>
              <button 
                @click="exportToCSV(dailyReport.transactions, `laporan-${dailyFilters.date}`)"
                class="btn btn-success btn-sm"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Waktu</th>
                  <th>Total</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in dailyReport.transactions" :key="transaction.id">
                  <td class="transaction-id">
                    #{{ transaction.id }}
                  </td>
                  <td class="transaction-date">
                    {{ formatDateTime(transaction.created_at) }}
                  </td>
                  <td class="transaction-total">
                    Rp {{ formatCurrency(transaction.total) }}
                  </td>
                  <td class="transaction-items">
                    <div v-if="transaction.items && transaction.items.length > 0" class="items-list">
                      <div v-for="item in transaction.items" :key="item.id" class="item-entry">
                        {{ item.name }} ({{ item.quantity }}x)
                      </div>
                    </div>
                    <span v-else class="no-items">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-container">
        <p class="error-text">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && ((activeTab === 'today' && !todayReport) || (activeTab === 'monthly' && !monthlyReport) || (activeTab === 'daily' && !dailyReport))" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="empty-text">Belum ada data laporan</p>
        <p class="empty-subtext">Klik tombol "Muat Data" atau "Tampilkan" untuk memuat laporan</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useReports } from '../composables/useReports'

const { 
  todayReport, 
  monthlyReport, 
  dailyReport,
  todayStats,
  monthlyStats,
  dailyStats,
  loading, 
  error, 
  loadTodayReport, 
  loadMonthlyReport: loadMonthlyReportComposable, 
  loadDateReport 
} = useReports()

const activeTab = ref('today')

const monthlyFilters = ref({
  month: String(new Date().getMonth() + 1).padStart(2, '0'),
  year: new Date().getFullYear()
})

const dailyFilters = ref({
  date: new Date().toISOString().split('T')[0]
})

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i)
  }
  return years
})

const loadMonthlyReportHandler = async () => {
  await loadMonthlyReportComposable(monthlyFilters.value.month, monthlyFilters.value.year)
}

const loadDailyReportHandler = async () => {
  if (dailyFilters.value.date) {
    await loadDateReport(dailyFilters.value.date)
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getMonthName = (monthNumber) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months[parseInt(monthNumber) - 1]
}

const exportToCSV = (transactions, filename) => {
  if (!transactions || transactions.length === 0) return

  const headers = ['ID', 'Tanggal', 'Total', 'Items']
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => {
      const items = transaction.items 
        ? transaction.items.map(item => `${item.name} (${item.quantity}x)`).join('; ')
        : ''
      return [
        transaction.id,
        formatDateTime(transaction.created_at),
        transaction.total,
        `"${items}"`
      ].join(',')
    })
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Alias methods for template
const loadMonthlyReport = loadMonthlyReportHandler
const loadDailyReport = loadDailyReportHandler

onMounted(() => {
  // Auto load today's report
  loadTodayReport()
})
</script>

<style scoped>
/* Container Styles */
.reports-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.reports-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 2rem;
}

/* Tab Navigation */
.tabs-container {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tabs-nav {
  display: flex;
  gap: 2rem;
  margin-bottom: -1px;
}

.tab-button {
  padding: 0.5rem 0.25rem;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  font-size: 0.875rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #374151;
  border-bottom-color: #d1d5db;
}

.tab-button.tab-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

/* Content Layout */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

/* Filter Container */
.filter-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.filter-grid.daily {
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}

/* Form Styles */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.button-group {
  justify-content: flex-end;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-select,
.form-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-success {
  background-color: #059669;
  color: white;
}

.btn-success:hover {
  background-color: #047857;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-block {
  width: 100%;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-value.green {
  color: #059669;
}

.stat-value.purple {
  color: #7c3aed;
}

.stat-icon {
  padding: 0.75rem;
  border-radius: 50%;
  margin-left: 1rem;
}

.stat-icon.blue {
  background-color: #dbeafe;
  color: #2563eb;
}

.stat-icon.green {
  background-color: #d1fae5;
  color: #059669;
}

.stat-icon.purple {
  background-color: #ede9fe;
  color: #7c3aed;
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #f9fafb;
}

.data-table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tbody tr {
  border-top: 1px solid #e5e7eb;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table td {
  padding: 1rem 1.5rem;
  vertical-align: top;
}

.transaction-id {
  font-size: 0.875rem;
  color: #1f2937;
  white-space: nowrap;
}

.transaction-date {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
}

.transaction-total {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
}

.transaction-items {
  font-size: 0.875rem;
  color: #6b7280;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-entry {
  font-size: 0.75rem;
}

.no-items {
  color: #9ca3af;
}

/* Error and Empty States */
.error-container {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
}

.error-text {
  color: #dc2626;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-icon {
  margin: 0 auto 1rem;
  height: 3rem;
  width: 3rem;
  color: #9ca3af;
}

.empty-text {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.empty-subtext {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 640px) {
  .reports-container {
    padding: 1rem;
  }
  
  .reports-title {
    font-size: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .table-header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .tabs-nav {
    flex-direction: column;
    gap: 0;
  }
  
  .tab-button {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 0;
  }
  
  .tab-button.tab-active {
    background-color: #f3f4f6;
  }
}
</style>
