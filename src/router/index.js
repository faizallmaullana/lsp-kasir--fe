import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Items from '../views/Items.vue'
import ItemDetail from '../views/ItemDetail.vue'
import NewTransaction from '../views/NewTransaction.vue'
import Transactions from '../views/Transactions.vue'
import Reports from '../views/Reports.vue'
import Kasir from '../views/Kasir.vue'
import Profile from '../views/ProfileView.vue'
import authService from '../services/authService.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
        title: 'Login'
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: 'Dashboard'
      }
    },
    {
      path: '/items',
      name: 'Items',
      component: Items,
      meta: {
        requiresAuth: true,
        title: 'Kelola Produk'
      }
    },
    {
      path: '/items/:id',
      name: 'ItemDetail',
      component: ItemDetail,
      meta: {
        requiresAuth: true,
        title: 'Detail Produk'
      }
    },
    {
      path: '/kasir',
      name: 'Kasir',
      component: Kasir,
      meta: {
        requiresAuth: true,
        title: 'Manajemen Kasir'
      }
    },
    {
      path: '/pos',
      name: 'NewTransaction',
      component: NewTransaction,
      meta: {
        requiresAuth: true,
        title: 'Point of Sale'
      }
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions,
      meta: {
        requiresAuth: true,
        title: 'Riwayat Transaksi'
      }
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports,
      meta: {
        requiresAuth: true,
  title: 'Laporan',
  requiresRole: 'ADMIN'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
  title: 'Profil Saya',
  requiresRole: 'ADMIN'
      }
    }
  ],
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  // Set document title
  document.title = to.meta.title ? `${to.meta.title} - KasirApp` : 'KasirApp'

  // If route requires a specific role, check role first (allow admin from localStorage)
  if (to.meta?.requiresRole) {
    const requiredRole = to.meta.requiresRole
    if (authService.hasRole(requiredRole)) {
      // Allow navigation based on stored role (useful for local dev or when user_data exists)
      next()
      return
    } else {
      // If role not present, fall through to auth check / redirect
      if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
        return
      }
      // Block access
      next('/dashboard')
      return
    }
  }

  // Check authentication requirements for routes without role-specific guard
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth but user is not authenticated
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if user is already authenticated and tries to access login
    next('/dashboard')
  } else {
    // Allow navigation
    next()
  }
})

export default router
