<template>
  <AppLayout>
    <div class="profile-page">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ isAdmin ? 'Manajemen User' : 'Profil Saya' }}</h1>
          <p class="page-subtitle">{{ isAdmin ? 'Kelola user dan profil dalam sistem' : 'Kelola informasi profil dan akun pengguna' }}</p>
        </div>
        <div class="header-actions">
          <button 
            v-if="isAdmin"
            @click="showAddUserModal = true" 
            class="btn btn-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Tambah User
          </button>
          <button 
            v-else
            @click="showAddProfileModal = true" 
            class="btn btn-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Tambah Profil
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat data profil...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
            <path d="M10 6v4m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3>Terjadi Kesalahan</h3>
        <p>{{ error }}</p>
        <button @click="loadCurrentUser" class="btn btn-primary">
          Coba Lagi
        </button>
      </div>

      <!-- Main Content -->
      <div v-else class="profile-content">
        <!-- User Info Card -->
        <div class="user-info-card">
          <div class="user-info-content">
            <div class="user-avatar-section">
              <div class="user-avatar-large">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
                </svg>
              </div>
              <div class="user-info-text">
                <h3 class="user-name">{{ currentUser?.email || 'Tidak diketahui' }}</h3>
                <div class="user-meta">
                  <span class="role-badge" :class="userRole.toLowerCase()">
                    {{ userRole }}
                  </span>
                  <span class="user-id">ID: {{ currentUser?.user_id || '-' }}</span>
                </div>
              </div>
            </div>
            <div class="user-actions">
              <button 
                @click="showEmailModal = true" 
                class="btn btn-secondary"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" fill="currentColor"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="currentColor"/>
                </svg>
                Ubah Email
              </button>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalProfiles }}</div>
              <div class="stat-label">Total Profil</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon active">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
                <path d="M10 1C5 1 1 5 1 10s4 9 9 9 9-4 9-9-4-9-9-9zM10 15a5 5 0 110-10 5 5 0 010 10z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ hasProfiles ? 'Ya' : 'Tidak' }}</div>
              <div class="stat-label">Profil Tersedia</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon admin">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ userRole }}</div>
              <div class="stat-label">Role Pengguna</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon inactive">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M3 7v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2 2H5a2 2 0 00-2 2z" fill="currentColor"/>
                <path d="M8 7V5a4 4 0 118 0v2m-4 6v2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ isAdmin ? 'Ya' : 'Tidak' }}</div>
              <div class="stat-label">Akses Admin</div>
            </div>
          </div>
        </div>

        <!-- Profiles List -->
        <div class="profiles-section">
          <div class="section-header">
            <h2>Daftar Profil</h2>
            <p>Kelola profil yang terkait dengan akun Anda</p>
          </div>

          <!-- Empty State -->
          <div v-if="!hasProfiles" class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Belum ada profil</h3>
            <p>Anda belum memiliki profil. Buat profil pertama untuk melengkapi informasi akun.</p>
            <button @click="showAddProfileModal = true" class="btn btn-primary">
              Buat Profil Pertama
            </button>
          </div>

          <!-- Profiles Grid -->
          <div v-else class="profiles-grid">
            <div 
              v-for="profile in profiles" 
              :key="profile.id_profile || profile.id" 
              class="profile-card"
            >
              <div class="profile-header">
                <div class="profile-avatar">
                  <img 
                    v-if="profile.image_url || profile.photo" 
                    :src="getProfileImageUrl(profile)"
                    :alt="profile.name"
                    @error="handleProfileImageError"
                  />
                  <div v-else class="profile-avatar-placeholder">
                    <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <div class="profile-actions">
                  <button 
                    @click="editProfile(profile)"
                    class="action-btn edit"
                    :disabled="loadingProfileId === (profile.id_profile || profile.id)"
                    title="Edit Profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDeleteProfile(profile)"
                    class="action-btn delete"
                    :disabled="loadingProfileId === (profile.id_profile || profile.id)"
                    title="Hapus Profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" fill="currentColor"/>
                      <path d="M6 5v2a1 1 0 102 0V5h4v2a1 1 0 102 0V5h1a1 1 0 100-2h-1V2a3 3 0 00-3-3H9a3 3 0 00-3 3v1H5a1 1 0 000 2h1z" fill="currentColor"/>
                      <path d="M7 10a1 1 0 012 0v6a1 1 0 11-2 0v-6zM13 10a1 1 0 10-2 0v6a1 1 0 102 0v-6z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="profile-content">
                <h3 class="profile-name">{{ profile.name }}</h3>
                <div class="profile-info">
                  <div class="info-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" fill="currentColor"/>
                    </svg>
                    <span>{{ profile.contact }}</span>
                  </div>
                  <div class="info-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
                    </svg>
                    <span>{{ profile.address }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Profile Modal -->
    <div v-if="showAddProfileModal" class="modal-overlay" @click.self="closeAddProfileModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Tambah Profil Baru</h2>
          <button @click="closeAddProfileModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleCreateProfile" class="modal-body">
          <div class="form-group">
            <label for="add-name">Nama Lengkap *</label>
            <input
              id="add-name"
              type="text"
              v-model="profileForm.formData.name"
              :class="['form-input', { 'error': profileForm.errors.name }]"
              placeholder="Masukkan nama lengkap"
              @blur="profileForm.validateName(profileForm.formData.name)"
            />
            <span v-if="profileForm.errors.name" class="error-text">
              {{ profileForm.errors.name }}
            </span>
          </div>

          <div class="form-group">
            <label for="add-contact">Kontak *</label>
            <input
              id="add-contact"
              type="text"
              v-model="profileForm.formData.contact"
              :class="['form-input', { 'error': profileForm.errors.contact }]"
              placeholder="Nomor telepon atau email"
              @blur="profileForm.validateContact(profileForm.formData.contact)"
            />
            <span v-if="profileForm.errors.contact" class="error-text">
              {{ profileForm.errors.contact }}
            </span>
          </div>

          <div class="form-group">
            <label for="add-address">Alamat *</label>
            <textarea
              id="add-address"
              v-model="profileForm.formData.address"
              :class="['form-textarea', { 'error': profileForm.errors.address }]"
              placeholder="Alamat lengkap"
              rows="3"
              @blur="profileForm.validateAddress(profileForm.formData.address)"
            ></textarea>
            <span v-if="profileForm.errors.address" class="error-text">
              {{ profileForm.errors.address }}
            </span>
          </div>

          <div class="form-group">
            <label for="add-image">URL Gambar</label>
            <input
              id="add-image"
              type="url"
              v-model="profileForm.formData.image_url"
              :class="['form-input', { 'error': profileForm.errors.image_url }]"
              placeholder="https://example.com/image.jpg (opsional)"
              @blur="profileForm.validateImageUrl(profileForm.formData.image_url)"
            />
            <span v-if="profileForm.errors.image_url" class="error-text">
              {{ profileForm.errors.image_url }}
            </span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeAddProfileModal" class="btn btn-secondary">
              Batal
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="profileForm.isSubmitting || !profileForm.isValid"
            >
              <span v-if="profileForm.isSubmitting" class="loading-spinner"></span>
              {{ profileForm.isSubmitting ? 'Menyimpan...' : 'Simpan Profil' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfileModal" class="modal-overlay" @click.self="closeEditProfileModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Profil</h2>
          <button @click="closeEditProfileModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleUpdateProfile" class="modal-body">
          <div class="form-group">
            <label for="edit-name">Nama Lengkap *</label>
            <input
              id="edit-name"
              type="text"
              v-model="editProfileForm.formData.name"
              :class="['form-input', { 'error': editProfileForm.errors.name }]"
              placeholder="Masukkan nama lengkap"
              @blur="editProfileForm.validateName(editProfileForm.formData.name)"
            />
            <span v-if="editProfileForm.errors.name" class="error-text">
              {{ editProfileForm.errors.name }}
            </span>
          </div>

          <div class="form-group">
            <label for="edit-contact">Kontak *</label>
            <input
              id="edit-contact"
              type="text"
              v-model="editProfileForm.formData.contact"
              :class="['form-input', { 'error': editProfileForm.errors.contact }]"
              placeholder="Nomor telepon atau email"
              @blur="editProfileForm.validateContact(editProfileForm.formData.contact)"
            />
            <span v-if="editProfileForm.errors.contact" class="error-text">
              {{ editProfileForm.errors.contact }}
            </span>
          </div>

          <div class="form-group">
            <label for="edit-address">Alamat *</label>
            <textarea
              id="edit-address"
              v-model="editProfileForm.formData.address"
              :class="['form-textarea', { 'error': editProfileForm.errors.address }]"
              placeholder="Alamat lengkap"
              rows="3"
              @blur="editProfileForm.validateAddress(editProfileForm.formData.address)"
            ></textarea>
            <span v-if="editProfileForm.errors.address" class="error-text">
              {{ editProfileForm.errors.address }}
            </span>
          </div>

          <div class="form-group">
            <label for="edit-image">URL Gambar</label>
            <input
              id="edit-image"
              type="url"
              v-model="editProfileForm.formData.image_url"
              :class="['form-input', { 'error': editProfileForm.errors.image_url }]"
              placeholder="https://example.com/image.jpg (opsional)"
              @blur="editProfileForm.validateImageUrl(editProfileForm.formData.image_url)"
            />
            <span v-if="editProfileForm.errors.image_url" class="error-text">
              {{ editProfileForm.errors.image_url }}
            </span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEditProfileModal" class="btn btn-secondary">
              Batal
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="editProfileForm.isSubmitting || !editProfileForm.isValid"
            >
              <span v-if="editProfileForm.isSubmitting" class="loading-spinner"></span>
              {{ editProfileForm.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Email Modal -->
    <div v-if="showEmailModal" class="modal-overlay" @click.self="closeEmailModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ubah Email</h2>
          <button @click="closeEmailModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleUpdateEmail" class="modal-body">
          <div class="form-group">
            <label for="current-email">Email Saat Ini</label>
            <input
              id="current-email"
              type="email"
              :value="currentUser?.email"
              class="form-input"
              disabled
            />
          </div>

          <div class="form-group">
            <label for="new-email">Email Baru *</label>
            <input
              id="new-email"
              type="email"
              v-model="emailForm.formData.email"
              :class="['form-input', { 'error': emailForm.errors.email }]"
              placeholder="Masukkan email baru"
              @blur="emailForm.validateEmail(emailForm.formData.email)"
            />
            <span v-if="emailForm.errors.email" class="error-text">
              {{ emailForm.errors.email }}
            </span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEmailModal" class="btn btn-secondary">
              Batal
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="emailForm.isSubmitting || !emailForm.isValid"
            >
              <span v-if="emailForm.isSubmitting" class="loading-spinner"></span>
              {{ emailForm.isSubmitting ? 'Menyimpan...' : 'Simpan Email' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add User Modal (Admin Only) -->
    <div v-if="showAddUserModal" class="modal-overlay" @click.self="closeAddUserModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Tambah User Baru</h2>
          <button @click="closeAddUserModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleCreateUser" class="modal-body">
          <!-- User Information Section -->
          <div class="form-section">
            <h3 class="section-title">Informasi Akun</h3>
            
            <div class="form-group">
              <label for="user-email">Email *</label>
              <input
                id="user-email"
                type="email"
                v-model="userForm.formData.email"
                :class="['form-input', { 'error': userForm.errors.email }]"
                placeholder="Masukkan email pengguna"
                @blur="userForm.validateEmail(userForm.formData.email)"
              />
              <span v-if="userForm.errors.email" class="error-text">
                {{ userForm.errors.email }}
              </span>
            </div>

            <div class="form-group">
              <label for="user-password">Password *</label>
              <input
                id="user-password"
                type="password"
                v-model="userForm.formData.password"
                :class="['form-input', { 'error': userForm.errors.password }]"
                placeholder="Minimal 6 karakter"
                @blur="userForm.validatePassword(userForm.formData.password)"
              />
              <span v-if="userForm.errors.password" class="error-text">
                {{ userForm.errors.password }}
              </span>
            </div>

            <div class="form-group">
              <label for="user-role">Role *</label>
              <select
                id="user-role"
                v-model="userForm.formData.role"
                :class="['form-input', { 'error': userForm.errors.role }]"
                @change="userForm.validateRole(userForm.formData.role)"
              >
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option>
              </select>
              <span v-if="userForm.errors.role" class="error-text">
                {{ userForm.errors.role }}
              </span>
            </div>
          </div>

          <!-- Profile Information Section -->
          <div class="form-section">
            <h3 class="section-title">Informasi Profil</h3>
            
            <div class="form-group">
              <label for="user-profile-name">Nama Lengkap *</label>
              <input
                id="user-profile-name"
                type="text"
                v-model="userForm.formData.profile.name"
                :class="['form-input', { 'error': userForm.errors.profile.name }]"
                placeholder="Masukkan nama lengkap"
                @blur="userForm.validateProfileName(userForm.formData.profile.name)"
              />
              <span v-if="userForm.errors.profile.name" class="error-text">
                {{ userForm.errors.profile.name }}
              </span>
            </div>

            <div class="form-group">
              <label for="user-profile-contact">Kontak *</label>
              <input
                id="user-profile-contact"
                type="text"
                v-model="userForm.formData.profile.contact"
                :class="['form-input', { 'error': userForm.errors.profile.contact }]"
                placeholder="Nomor telepon atau email"
                @blur="userForm.validateProfileContact(userForm.formData.profile.contact)"
              />
              <span v-if="userForm.errors.profile.contact" class="error-text">
                {{ userForm.errors.profile.contact }}
              </span>
            </div>

            <div class="form-group">
              <label for="user-profile-address">Alamat *</label>
              <textarea
                id="user-profile-address"
                v-model="userForm.formData.profile.address"
                :class="['form-textarea', { 'error': userForm.errors.profile.address }]"
                placeholder="Alamat lengkap"
                rows="3"
                @blur="userForm.validateProfileAddress(userForm.formData.profile.address)"
              ></textarea>
              <span v-if="userForm.errors.profile.address" class="error-text">
                {{ userForm.errors.profile.address }}
              </span>
            </div>

            <div class="form-group">
              <label for="user-profile-image">URL Gambar</label>
              <input
                id="user-profile-image"
                type="url"
                v-model="userForm.formData.profile.image_url"
                :class="['form-input', { 'error': userForm.errors.profile.image_url }]"
                placeholder="https://example.com/image.jpg (opsional)"
                @blur="userForm.validateProfileImageUrl(userForm.formData.profile.image_url)"
              />
              <span v-if="userForm.errors.profile.image_url" class="error-text">
                {{ userForm.errors.profile.image_url }}
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeAddUserModal" class="btn btn-secondary">
              Batal
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="userForm.isSubmitting || !userForm.isValid"
            >
              <span v-if="userForm.isSubmitting" class="loading-spinner"></span>
              {{ userForm.isSubmitting ? 'Membuat User...' : 'Buat User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Konfirmasi Hapus</h2>
          <button @click="closeDeleteModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="delete-confirmation">
            <div class="warning-icon">
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
                <path d="M10 6v4m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" fill="#ef4444"/>
              </svg>
            </div>
            <h3>Yakin ingin menghapus profil?</h3>
            <p>Profil <strong>{{ profileToDelete?.name }}</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.</p>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeDeleteModal" class="btn btn-secondary">
              Batal
            </button>
            <button 
              @click="handleDeleteProfile"
              class="btn btn-danger"
              :disabled="loading"
            >
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProfile } from '../composables/useProfile.js'
import { useProfileForm, useUserForm } from '../composables/useProfileForm.js'
import { useEmailForm } from '../composables/useEmailForm.js'
import imagesService from '../services/imagesService.js'
import AppLayout from '../components/AppLayout.vue'

// Profile composable
const {
  currentUser,
  profiles,
  loading,
  error,
  loadingProfileId,
  totalProfiles,
  hasProfiles,
  userRole,
  userEmail,
  isAdmin,
  isCashier,
  loadCurrentUser,
  createProfile,
  updateProfile,
  deleteProfile,
  createUser,
  updateUserEmail
} = useProfile()

// Form composables
const profileForm = useProfileForm()
const editProfileForm = useProfileForm()
const emailForm = useEmailForm()
const userForm = useUserForm()

// Modal states
const showAddProfileModal = ref(false)
const showAddUserModal = ref(false)
const showEditProfileModal = ref(false)
const showEmailModal = ref(false)
const showDeleteModal = ref(false)

// Edit states
const profileToEdit = ref(null)
const profileToDelete = ref(null)

// Load data on component mount
onMounted(async () => {
  await loadCurrentUser()
})

// Profile image handling
const getProfileImageUrl = (profile) => {
  const imageUrl = profile.image_url || profile.photo
  if (!imageUrl) return null
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  // Otherwise, construct the URL using the images service
  return imagesService.getImageUrl(imageUrl)
}

const handleProfileImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.classList.add('error')
}

// Modal handlers
const closeAddProfileModal = () => {
  showAddProfileModal.value = false
  profileForm.resetForm()
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
  userForm.resetForm()
}

const closeEditProfileModal = () => {
  showEditProfileModal.value = false
  editProfileForm.resetForm()
  profileToEdit.value = null
}

const closeEmailModal = () => {
  showEmailModal.value = false
  emailForm.resetForm()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  profileToDelete.value = null
}

// User handlers (Admin only)
const handleCreateUser = async () => {
  if (!userForm.validateForm()) {
    return
  }

  userForm.isSubmitting.value = true
  
  try {
    const success = await createUser(userForm.getFormData())
    if (success) {
      closeAddUserModal()
      // Show success notification
      console.log('User berhasil dibuat')
      // Optionally reload data if needed
      // await loadCurrentUser()
    }
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    userForm.isSubmitting.value = false
  }
}

// Profile handlers
const handleCreateProfile = async () => {
  if (!profileForm.validateForm()) {
    return
  }

  profileForm.isSubmitting.value = true
  
  try {
    const success = await createProfile(profileForm.getFormData())
    if (success) {
      closeAddProfileModal()
      // Show success notification (you can implement a notification system)
      console.log('Profil berhasil dibuat')
    }
  } catch (error) {
    console.error('Error creating profile:', error)
  } finally {
    profileForm.isSubmitting.value = false
  }
}

const editProfile = (profile) => {
  profileToEdit.value = profile
  editProfileForm.populateForm(profile)
  showEditProfileModal.value = true
}

const handleUpdateProfile = async () => {
  if (!editProfileForm.validateForm()) {
    return
  }

  editProfileForm.isSubmitting.value = true
  
  try {
    const profileId = profileToEdit.value.id_profile || profileToEdit.value.id
    const success = await updateProfile(profileId, editProfileForm.getFormData())
    if (success) {
      closeEditProfileModal()
      // Show success notification
      console.log('Profil berhasil diperbarui')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    editProfileForm.isSubmitting.value = false
  }
}

const confirmDeleteProfile = (profile) => {
  profileToDelete.value = profile
  showDeleteModal.value = true
}

const handleDeleteProfile = async () => {
  try {
    const profileId = profileToDelete.value.id_profile || profileToDelete.value.id
    const success = await deleteProfile(profileId)
    if (success) {
      closeDeleteModal()
      // Show success notification
      console.log('Profil berhasil dihapus')
    }
  } catch (error) {
    console.error('Error deleting profile:', error)
  }
}

// Email handlers
const handleUpdateEmail = async () => {
  if (!emailForm.validateForm()) {
    return
  }

  emailForm.isSubmitting.value = true
  
  try {
    const success = await updateUserEmail(emailForm.getFormData())
    if (success) {
      closeEmailModal()
      // Show success notification
      console.log('Email berhasil diperbarui')
    }
  } catch (error) {
    console.error('Error updating email:', error)
  } finally {
    emailForm.isSubmitting.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.header-content p {
  color: #64748b;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  color: #334155;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* User Info Card */
.user-info-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  overflow: hidden;
}

.user-info-content {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.cashier {
  background: #d1fae5;
  color: #065f46;
}

.role-badge.user {
  background: #e0e7ff;
  color: #3730a3;
}

.user-id {
  color: #64748b;
  font-size: 0.875rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.total {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.stat-icon.active {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
}

.stat-icon.inactive {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.stat-icon.admin {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #be185d;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
}

/* Profiles Section */
.profiles-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.section-header p {
  color: #64748b;
  margin: 0;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

/* Profiles Grid */
.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.profile-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
}

.profile-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.edit {
  background: #f0f9ff;
  color: #0369a1;
}

.action-btn.edit:hover:not(:disabled) {
  background: #0369a1;
  color: white;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.delete:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.profile-content {
  padding: 0 1.5rem 1.5rem;
}

.profile-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-content.small {
  max-width: 400px;
}

.modal-content.large {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.modal-body {
  padding: 0 2rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input.error, .form-textarea.error {
  border-color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title:before {
  content: '';
  width: 4px;
  height: 1.125rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 2px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Delete Confirmation */
.delete-confirmation {
  text-align: center;
}

.warning-icon {
  margin-bottom: 1rem;
}

.delete-confirmation h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.delete-confirmation p {
  color: #64748b;
  margin-bottom: 2rem;
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-left-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .user-info-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .user-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .profiles-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
