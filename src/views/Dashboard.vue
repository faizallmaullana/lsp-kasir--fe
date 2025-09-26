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

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Penjualan Hari Ini</h3>
              <p class="stat-value">Rp 2,450,000</p>
              <span class="stat-change positive">+12% dari kemarin</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Transaksi</h3>
              <p class="stat-value">156</p>
              <span class="stat-change positive">+8 transaksi</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>Produk Terjual</h3>
              <p class="stat-value">342</p>
              <span class="stat-change neutral">Stabil</span>
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
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()

const logout = () => {
  // Implementasi logout
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
}
</style>
