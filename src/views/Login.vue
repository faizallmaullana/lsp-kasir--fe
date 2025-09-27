<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#2563eb"/>
              <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h10v2H12v-2z" fill="white"/>
            </svg>
          </div>
          <h1>Dapur Bunda Bahagia</h1>
        </div>
        <p class="subtitle">Sistem Kasir Modern & Mudah</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 1114 0H3z" fill="#6b7280"/>
            </svg>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              placeholder="Masukkan username"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 8V6a5 5 0 0110 0v2h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2h1zm2 0h6V6a3 3 0 00-6 0v2z" fill="#6b7280"/>
            </svg>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="form.password" 
              placeholder="Masukkan password"
              required
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.26 11.602C3.942 8.327 6.793 6 10 6c3.206 0 6.057 2.327 6.74 5.602a.5.5 0 01-.48.648H3.74a.5.5 0 01-.48-.648zM10 9a2 2 0 100 4 2 2 0 000-4z" fill="#6b7280"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.854 2.146a.5.5 0 10-.708.708l3.5 3.5a8.773 8.773 0 00-2.72 5.248.5.5 0 00.48.648h13.188l2.552 2.552a.5.5 0 00.708-.708l-15-15z" fill="#6b7280"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.rememberMe">
            <span class="checkmark"></span>
            Ingat saya
          </label>
          <a href="#" class="forgot-password">Lupa password?</a>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" fill="currentColor"/>
          </svg>
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <svg v-if="loading" class="loading-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a8 8 0 018 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span v-if="!loading">Masuk</span>
          <span v-else>Memproses...</span>
        </button>
      </form>

      <div class="login-footer">
        <p>Belum punya akun? <a href="#" class="register-link">Daftar sekarang</a></p>
      </div>
    </div>

    <div class="features-section">
      <h3>Fitur Unggulan</h3>
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h4>Keamanan Terjamin</h4>
            <p>Data transaksi terenkripsi dan aman</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h4>Performa Cepat</h4>
            <p>Proses transaksi dalam hitungan detik</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h4>Laporan Lengkap</h4>
            <p>Analisis penjualan yang mendalam</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { login, loading, error, clearError } = useAuth()

const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)

const handleLogin = async () => {
  // Clear any previous errors
  clearError()
  
  // Prepare credentials (map username to email for API)
  const credentials = {
    email: form.value.username, // Assuming username is email
    password: form.value.password
  }
  
  // Attempt login
  const success = await login(credentials)
  
  if (success) {
    console.log('Login berhasil')
    // Redirect akan ditangani oleh useAuth composable
  } else {
    console.error('Login gagal:', error.value)
    // Error akan ditampilkan di template melalui error reactive
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e40af;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.password-toggle:hover {
  background-color: #f3f4f6;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #374151;
}

.remember-me input {
  display: none;
}

.checkmark {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  position: relative;
  transition: all 0.2s;
}

.remember-me input:checked + .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.remember-me input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0.125rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.error-message svg {
  flex-shrink: 0;
  color: #dc2626;
}

.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.49);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.register-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.features-section {
  background: white;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.features-section h3 {
  color: #1e40af;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon.blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.feature-item h4 {
  margin: 0 0 0.25rem 0;
  color: #1e40af;
  font-size: 1rem;
  font-weight: 600;
}

.feature-item p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  
  .features-section {
    padding: 2rem 1rem;
  }
  
  .features-section h3 {
    font-size: 1.25rem;
  }
  
  .login-card {
    padding: 1.5rem;
    min-height: 100vh;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1rem;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .features-list {
    gap: 1rem;
  }
  
  .feature-item {
    gap: 0.75rem;
  }
}
</style>
