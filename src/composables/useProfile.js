import { ref, computed } from 'vue'
import profileService from '../services/profileService.js'

// Global state
const currentUser = ref(null)
const profiles = ref([])
const users = ref([])
const loading = ref(false)
const error = ref(null)
const loadingProfileId = ref(null)

export function useProfile() {
  // Load current user and their profiles
  const loadCurrentUser = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await profileService.getMe()
      if (response.success) {
        // Based on API spec: direct response format
        currentUser.value = {
          user_id: response.data.user_id,
          email: response.data.email,
          role: response.data.role
        }
        // Map profiles to ensure image_url is available (API spec notes this mapping)
        profiles.value = (response.data.profiles || []).map(profile => ({
          ...profile,
          image_url: profile.image_url || profile.photo
        }))
      } else {
        error.value = response.error || 'Gagal memuat data profil'
      }
      return response
    } catch (err) {
      error.value = err.message || 'Gagal memuat data profil'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Create new profile
  const createProfile = async (profileData) => {
    loading.value = true
    error.value = null
    try {
      console.log('useProfile createProfile called with:', profileData)
      
      const response = await profileService.createProfile(profileData)
      console.log('useProfile service response:', response)
      
      if (response.success) {
        // Add to local profiles array with proper mapping
        const newProfile = {
          ...response.data,
          image_url: response.data.image_url || response.data.photo
        }
        profiles.value.unshift(newProfile)
        return true
      } else {
        error.value = response.error || 'Gagal menambah profil'
        console.error('Create profile failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal menambah profil'
      console.error('Create profile error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Update existing profile
  const updateProfile = async (profileId, profileData) => {
    loadingProfileId.value = profileId
    error.value = null
    try {
      console.log('useProfile updateProfile called with:', profileId, profileData)
      
      const response = await profileService.updateProfile(profileId, profileData)
      console.log('useProfile update response:', response)
      
      if (response.success) {
        // Update local profiles array with proper mapping
        const index = profiles.value.findIndex(profile => 
          profile.id_profile === profileId || profile.id === profileId
        )
        if (index !== -1) {
          const updatedProfile = {
            ...profiles.value[index],
            ...response.data,
            image_url: response.data.image_url || response.data.photo
          }
          profiles.value[index] = updatedProfile
        }
        return true
      } else {
        error.value = response.error || 'Gagal mengupdate profil'
        console.error('Update profile failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengupdate profil'
      console.error('Update profile error:', err)
      return false
    } finally {
      loadingProfileId.value = null
    }
  }

  // Delete profile
  const deleteProfile = async (profileId) => {
    loadingProfileId.value = profileId
    error.value = null
    try {
      console.log('useProfile deleteProfile called with:', profileId)
      
      const response = await profileService.deleteProfile(profileId)
      console.log('useProfile delete response:', response)
      
      if (response.success) {
        // Remove from local profiles array
        const index = profiles.value.findIndex(profile => 
          profile.id_profile === profileId || profile.id === profileId
        )
        if (index !== -1) {
          profiles.value.splice(index, 1)
        }
        return true
      } else {
        error.value = response.error || 'Gagal menghapus profil'
        console.error('Delete profile failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal menghapus profil'
      console.error('Delete profile error:', err)
      return false
    } finally {
      loadingProfileId.value = null
    }
  }



    // Load all users (for all users)
  const loadAllUsers = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      console.log('🔄 useProfile.loadAllUsers: Starting API request...')
      console.log('📤 useProfile.loadAllUsers: Calling profileService.getAllUsers with params:', params)
      
      const response = await profileService.getAllUsers(params)
      console.log('📥 useProfile.loadAllUsers: API response received:', response)
      
      if (response.success) {
        // Store users data according to API spec
        users.value = response.data || []
        console.log('✅ useProfile.loadAllUsers: Success! Users stored:', users.value)
        console.log('📊 useProfile.loadAllUsers: Total users count:', users.value.length)
        return true
      } else {
        error.value = response.error || 'Gagal memuat data users'
        console.error('❌ useProfile.loadAllUsers: Failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal memuat data users'
      console.error('💥 useProfile.loadAllUsers: Error:', err)
      return false
    } finally {
      loading.value = false
      console.log('🏁 useProfile.loadAllUsers: Complete')
    }
  }

  // Create new user with profile (Admin only)
  const createUser = async (userData) => {
    loading.value = true
    error.value = null
    try {
      console.log('useProfile createUser called with:', userData)
      
      const response = await profileService.createUser(userData)
      console.log('useProfile createUser response:', response)
      
      if (response.success) {
        // Refresh users list after creating new user
        await loadAllUsers()
        return true
      } else {
        error.value = response.error || 'Gagal membuat user'
        console.error('Create user failed:', response.error)
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal membuat user'
      console.error('Create user error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Update user email
  const updateUserEmail = async (newEmail) => {
    loading.value = true
    error.value = null
    try {
      const response = await profileService.updateEmail(newEmail)
      if (response.success) {
        if (currentUser.value) {
          currentUser.value.email = response.data.email
        }
        return true
      } else {
        error.value = response.error || 'Gagal mengupdate email'
        return false
      }
    } catch (err) {
      error.value = err.message || 'Gagal mengupdate email'
      return false
    } finally {
      loading.value = false
    }
  }

  // Reset state
  const resetState = () => {
    currentUser.value = null
    profiles.value = []
    users.value = []
    error.value = null
    loading.value = false
    loadingProfileId.value = null
  }

  // Computed properties
  const totalProfiles = computed(() => profiles.value.length)
  const hasProfiles = computed(() => profiles.value.length > 0)
  const totalUsers = computed(() => users.value.length)
  const hasUsers = computed(() => users.value.length > 0)
  const userRole = computed(() => currentUser.value?.role || 'USER')
  const userEmail = computed(() => currentUser.value?.email || '')
  const isAdmin = computed(() => userRole.value === 'ADMIN')
  const isCashier = computed(() => userRole.value === 'CASHIER')

  // Expose reactive state and methods
  return {
    // State
    currentUser: computed(() => currentUser.value),
    profiles: computed(() => profiles.value),
    users: computed(() => users.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadingProfileId: computed(() => loadingProfileId.value),
    
    // Computed
    totalProfiles,
    hasProfiles,
    totalUsers,
    hasUsers,
    userRole,
    userEmail,
    isAdmin,
    isCashier,
    
    // Methods
    loadCurrentUser,
    loadAllUsers,
    createProfile,
    updateProfile,
    deleteProfile,
    createUser,
    updateUserEmail,
    resetState
  }
}
