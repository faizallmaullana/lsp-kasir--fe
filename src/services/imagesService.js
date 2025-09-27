import { api as apiClient } from '../config/axios.js'

/**
 * Images Service
 * Berdasarkan images_api.md specification
 * Provides methods for image upload, download, and management
 */
class ImagesService {
  /**
   * Upload image via multipart form data
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload response with id_image and file_name
   */
  async uploadMultipart(file) {
    try {
      if (!file) {
        return {
          success: false,
          error: 'File is required',
          status: 'BAD_REQUEST'
        }
      }

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading image file:', file.name, 'size:', file.size)

      const response = await apiClient.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Upload multipart response:', response.data)

      if (response.data.STATUS === 'created') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to upload image',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Upload multipart error:', error)

      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 400:
            return {
              success: false,
              error: 'Missing file or invalid format',
              status: 'BAD_REQUEST'
            }
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to upload image',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to upload image',
              status: 'UNKNOWN_ERROR'
            }
        }
      }

      return {
        success: false,
        error: 'Network error or server unavailable: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Upload image via base64
   * @param {string} fileName - Suggested file name
   * @param {string} contentType - MIME type (e.g., image/png)
   * @param {string} dataBase64 - Base64 encoded image data
   * @returns {Promise<Object>} Upload response with id_image and file_name
   */
  async uploadBase64(fileName, contentType, dataBase64) {
    try {
      if (!fileName || !contentType || !dataBase64) {
        return {
          success: false,
          error: 'fileName, contentType, and dataBase64 are required',
          status: 'BAD_REQUEST'
        }
      }

      const requestData = {
        file_name: fileName,
        content_type: contentType,
        data_base64: dataBase64
      }

      console.log('Uploading base64 image:', fileName, contentType)

      const response = await apiClient.post('/images/upload/base64', requestData)

      console.log('Upload base64 response:', response.data)

      if (response.data.STATUS === 'created') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: response.data.ERROR || 'Failed to upload image',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Upload base64 error:', error)

      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 400:
            return {
              success: false,
              error: 'Invalid base64 data or missing required fields',
              status: 'BAD_REQUEST'
            }
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 500:
            return {
              success: false,
              error: data.ERROR || 'Failed to upload image',
              status: 'INTERNAL_SERVER_ERROR'
            }
          default:
            return {
              success: false,
              error: 'Failed to upload image',
              status: 'UNKNOWN_ERROR'
            }
        }
      }

      return {
        success: false,
        error: 'Network error or server unavailable: ' + error.message,
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Download image as blob
   * @param {string} imageId - Image UUID
   * @returns {Promise<Object>} Blob response or error
   */
  async downloadBlob(imageId) {
    try {
      if (!imageId) {
        return {
          success: false,
          error: 'Image ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.get(`/images/${imageId}`, {
        responseType: 'blob'
      })

      return {
        success: true,
        data: response.data,
        contentType: response.headers['content-type']
      }
    } catch (error) {
      console.error('Download blob error:', error)

      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Image not found',
          status: 'NOT_FOUND'
        }
      }

      return {
        success: false,
        error: 'Failed to download image',
        status: 'DOWNLOAD_ERROR'
      }
    }
  }

  /**
   * Download image as base64
   * @param {string} imageId - Image UUID
   * @returns {Promise<Object>} Base64 response
   */
  async downloadBase64(imageId) {
    try {
      if (!imageId) {
        return {
          success: false,
          error: 'Image ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.get(`/images/${imageId}/base64`)

      if (response.data.STATUS === 'OK') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: 'Failed to download image',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Download base64 error:', error)

      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Image not found',
          status: 'NOT_FOUND'
        }
      }

      return {
        success: false,
        error: 'Failed to download image',
        status: 'DOWNLOAD_ERROR'
      }
    }
  }

  /**
   * Delete image
   * @param {string} imageId - Image UUID
   * @returns {Promise<Object>} Delete response
   */
  async delete(imageId) {
    try {
      if (!imageId) {
        return {
          success: false,
          error: 'Image ID is required',
          status: 'BAD_REQUEST'
        }
      }

      const response = await apiClient.delete(`/images/${imageId}`)

      if (response.data.STATUS === 'deleted') {
        return {
          success: true,
          data: response.data.DATA,
          message: response.data.MESSAGE
        }
      } else {
        return {
          success: false,
          error: 'Failed to delete image',
          status: response.data.STATUS
        }
      }
    } catch (error) {
      console.error('Delete image error:', error)

      if (error.response) {
        const { status } = error.response

        switch (status) {
          case 401:
            return {
              success: false,
              error: 'Authentication required',
              status: 'UNAUTHORIZED'
            }
          case 404:
            return {
              success: false,
              error: 'Image not found',
              status: 'NOT_FOUND'
            }
          default:
            return {
              success: false,
              error: 'Failed to delete image',
              status: 'DELETE_ERROR'
            }
        }
      }

      return {
        success: false,
        error: 'Network error or server unavailable',
        status: 'NETWORK_ERROR'
      }
    }
  }

  /**
   * Convert file to base64
   * @param {File} file - File to convert
   * @returns {Promise<Object>} Base64 data and content type
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('File is required'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = () => {
        try {
          // Remove data:image/png;base64, prefix
          const base64Data = reader.result.split(',')[1]
          
          resolve({
            success: true,
            data: {
              fileName: file.name,
              contentType: file.type || 'application/octet-stream',
              dataBase64: base64Data,
              size: file.size
            }
          })
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateImageFile(file) {
    const errors = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (!file) {
      errors.push('File is required')
      return { isValid: false, errors }
    }

    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB')
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type must be JPEG, PNG, GIF, or WebP')
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileSize: file.size,
      fileType: file.type
    }
  }

  /**
   * Get image URL for display
   * @param {string} fileName - Generated file name from API
   * @returns {string} Full URL to image
   */
  getImageUrl(fileName) {
    if (!fileName) return null
    
    // If it's already a full URL, return as is
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
      return fileName
    }

    // Construct URL using the Images API endpoint
    // Format: http://localhost:8000/api/images/file/{filename}
    const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000/api/images'
    return `${imageBaseUrl}/file/${fileName}`
  }
}

// Create and export a singleton instance
const imagesService = new ImagesService()
export default imagesService

// Also export the class for testing purposes
export { ImagesService }
