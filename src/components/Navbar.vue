<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="nav-brand">
        <RouterLink to="/dashboard" class="brand-link">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#2563eb"/>
              <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h10v2H12v-2z" fill="white"/>
            </svg>
          </div>
          <span>KasirApp</span>
        </RouterLink>
      </div>
      
      <div class="nav-menu">
        <RouterLink 
          to="/dashboard" 
          class="nav-link"
          :class="{ active: $route.path === '/dashboard' }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor"/>
          </svg>
          Dashboard
        </RouterLink>
        
        <!-- <RouterLink 
          to="/kasir" 
          class="nav-link"
          :class="{ active: $route.path === '/kasir' }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM6 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6zM8 8a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" fill="currentColor"/>
          </svg>
          Kasir
        </RouterLink> -->
        
        <RouterLink 
          to="/pos" 
          class="nav-link"
          :class="{ active: $route.path === '/pos' }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 2v20m8-10H4" stroke="currentColor" stroke-width="2"/>
          </svg>
          POS
        </RouterLink>
        
        <RouterLink 
          to="/items" 
          class="nav-link"
          :class="{ active: $route.path.startsWith('/items') }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" fill="currentColor"/>
          </svg>
          Produk
        </RouterLink>
        
        <RouterLink 
          to="/transactions" 
          class="nav-link"
          :class="{ active: $route.path === '/transactions' }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M7 13v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6 0a2 2 0 002-2V9a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2" fill="currentColor"/>
          </svg>
          Transaksi
        </RouterLink>
        
        <RouterLink 
          to="/reports" 
          class="nav-link"
          :class="{ active: $route.path === '/reports' }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" fill="currentColor"/>
          </svg>
          Laporan
        </RouterLink>
        
        <RouterLink 
          to="/profile" 
          class="nav-link"
          :class="{ active: $route.path === '/profile' }"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
          </svg>
          Profil
        </RouterLink>
      </div>

      <div class="nav-actions">
        <div class="user-menu">
          <button class="user-button" @click="showUserMenu = !showUserMenu">
            <div class="user-avatar">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
              </svg>
            </div>
            <span class="user-name">Admin</span>
            <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill="currentColor"/>
            </svg>
          </button>
          
          <div v-if="showUserMenu" class="user-dropdown">
            <a href="#" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
              </svg>
              Profil
            </a>
            <a href="#" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 4a1 1 0 100 2v7.268a2 2 0 010 3.464V18a1 1 0 100 2v-1.268a2 2 0 010-3.464V6a1 1 0 100-2z" fill="currentColor"/>
              </svg>
              Pengaturan
            </a>
            <hr class="dropdown-divider">
            <button @click="logout" class="dropdown-item logout">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M3 3a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 0h4.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 3H19a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { logout: authLogout, user } = useAuth()
const showUserMenu = ref(false)

const logout = () => {
  showUserMenu.value = false
  authLogout()
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #1e40af;
  font-size: 1.25rem;
  font-weight: 700;
  transition: color 0.2s;
}

.brand-link:hover {
  color: #1d4ed8;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #64748b;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #475569;
}

.nav-link.active {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.nav-actions {
  flex-shrink: 0;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}

.user-button:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.dropdown-icon {
  transition: transform 0.2s;
}

.user-button:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.dropdown-divider {
  margin: 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }
  
  .nav-menu {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>
