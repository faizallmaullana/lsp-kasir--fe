# Authentication Service Documentation

## Overview
Service untuk menangani autentikasi pengguna berdasarkan API specification yang diberikan.

## Files Created

### 1. `/src/services/authService.js`
**Service utama untuk autentikasi** yang menyediakan:

#### Methods:
- `login(credentials)` - Login dengan email dan password
- `refreshToken()` - Refresh JWT token yang ada
- `logout()` - Logout dan clear stored data
- `isAuthenticated()` - Cek status autentikasi
- `getUser()` / `setUser()` - Manage data user
- `getToken()` / `setToken()` - Manage JWT token
- `getUserRole()` - Ambil role user
- `hasRole(role)` - Cek apakah user memiliki role tertentu
- `getAuthHeader()` - Header authorization untuk API request

#### Features:
- ✅ Token management otomatis
- ✅ Error handling komprehensif
- ✅ User data persistence
- ✅ JWT token validation
- ✅ Singleton pattern

### 2. `/src/composables/useAuth.js`
**Vue composable untuk reactive authentication state:**

#### Reactive State:
- `loading` - Status loading
- `error` - Error message
- `isAuthenticated` - Status autentikasi
- `user` - Data user
- `userRole` - Role user

#### Methods:
- `login(credentials)` - Login dan redirect
- `logout()` - Logout dan redirect
- `refreshToken()` - Refresh token
- `hasRole(role)` - Cek role
- `clearError()` - Clear error message
- `initializeAuth()` - Initialize auth state

### 3. `/src/services/index.js`
Export semua services untuk kemudahan import.

## Integration

### 1. Login Page (`/src/views/Login.vue`)
✅ **Updated to use authentication service:**
- Form login terintegrasi dengan API
- Error handling dan display
- Loading state management
- Auto redirect setelah login sukses

### 2. Router Guards (`/src/router/index.js`)
✅ **Added authentication protection:**
- Route protection berdasarkan `requiresAuth` meta
- Auto redirect ke login jika tidak authenticated
- Auto redirect ke dashboard jika sudah login
- Dynamic document title

### 3. Navbar Component (`/src/components/Navbar.vue`)
✅ **Updated logout functionality:**
- Menggunakan authentication service
- Clear token dan redirect ke login

### 4. Axios Configuration (`/src/config/axios.js`)
✅ **Enhanced with authentication support:**
- Auto attach JWT token ke request headers
- Response interceptor untuk handle 401 (auto logout)
- Error handling untuk berbagai status codes

## API Endpoints

Sesuai dengan dokumentasi API yang diberikan:

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "MESSAGE": "SUCCESS",
  "STATUS": "OK", 
  "DATA": {
    "user": {
      "id_user": "string",
      "email": "string", 
      "role": "string",
      "timestamp": "2025-09-26T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer <token>
```

## Usage Examples

### 1. Using in Components
```javascript
import { useAuth } from '../composables/useAuth.js'

export default {
  setup() {
    const { login, logout, isAuthenticated, user } = useAuth()
    
    const handleLogin = async () => {
      const success = await login({
        email: 'admin@example.com',
        password: 'password123'
      })
      
      if (success) {
        console.log('Login successful!')
      }
    }
    
    return { handleLogin, logout, isAuthenticated, user }
  }
}
```

### 2. Direct Service Usage
```javascript
import authService from '../services/authService.js'

// Login
const result = await authService.login({
  email: 'admin@example.com',
  password: 'password123'
})

// Check authentication
if (authService.isAuthenticated()) {
  const user = authService.getUser()
  console.log('User:', user)
}
```

## Environment Configuration

File `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_TITLE=Dapur Bunda Bahagia
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
VITE_DEBUG=true
```

## Error Handling

Service menangani berbagai skenario error:

- **400 Bad Request**: Validation error
- **401 Unauthorized**: Invalid credentials atau token expired
- **500 Internal Server Error**: Server error
- **Network Error**: Connection problems

Semua error dikembalikan dalam format konsisten:
```javascript
{
  success: false,
  error: "Error message",
  status: "ERROR_TYPE"
}
```

## Security Features

- ✅ JWT token stored in localStorage
- ✅ Auto token refresh sebelum expired
- ✅ Auto logout saat token invalid
- ✅ Route protection
- ✅ Request/response interceptors
- ✅ CSRF protection ready

## Next Steps

1. **Test dengan Backend API** - Pastikan endpoint sesuai dengan dokumentasi
2. **Add Role-based Access Control** - Implementasi permission berdasarkan role
3. **Add Remember Me** - Persistent login dengan refresh token
4. **Add Password Reset** - Fitur reset password
5. **Add Multi-factor Authentication** - 2FA support

## Testing

Aplikasi sudah berjalan di `http://localhost:5173/` dan siap untuk testing dengan backend API yang sesuai dengan dokumentasi.
