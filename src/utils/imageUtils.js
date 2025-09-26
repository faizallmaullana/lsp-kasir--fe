/**
 * Image Utilities
 * Handles image URLs, base64 data, and fallbacks based on API specification
 */

// Get image base URL from environment
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 
                      import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 
                      'http://localhost:8000'

/**
 * Get image source URL from item data
 * @param {Object} item - Item object from API
 * @returns {string|null} - Image URL or null if no image
 */
export const getImageSrc = (item) => {
  if (!item) return null

  console.log('Getting image source for item:', {
    id: item.id_item,
    image_url: item.image_url,
    has_base64: !!item.image_base64
  })
  
  // Primary: Check if item has image URL (this is the main field from API)
  if (item.image_url) {
    // If it's a full URL, use it directly
    if (item.image_url.startsWith('http')) {
      return item.image_url
    }
    
    // If it's a generated filename from server storage
    // According to API spec: server saves to storages/images and stores filename in image_url
    const imageUrl = `${IMAGE_BASE_URL}/storage/images/${item.image_url}`
    console.log('Constructed storage image URL:', imageUrl)
    return imageUrl
  }
  
  // Fallback: Direct base64 display (if API returns base64 data)
  if (item.image_base64) {
    console.log('Using base64 image data')
    const base64Data = item.image_base64
    
    if (base64Data.startsWith('data:')) {
      return base64Data // Already has data URI prefix
    } else {
      // Add data URI prefix
      const mimeType = item.image_type || 'image/jpeg'
      return `data:${mimeType};base64,${base64Data}`
    }
  }
  
  console.log('No image found for item')
  return null
}

/**
 * Get image alt text for accessibility
 * @param {Object} item - Item object
 * @returns {string} - Alt text for image
 */
export const getImageAlt = (item) => {
  return item?.item_name || 'Product Image'
}

/**
 * Handle image loading errors
 * @param {Event} event - Image error event
 */
export const handleImageError = (event) => {
  console.log('Image failed to load:', event.target.src)
  
  // Hide the failed image
  event.target.style.display = 'none'
  
  // Show placeholder if available
  const container = event.target.parentNode
  const placeholder = container?.querySelector('.image-placeholder')
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

/**
 * Validate image file for upload
 * @param {File} file - File object to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateImageFile = (file) => {
  const errors = []
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  if (!file) {
    errors.push('File tidak ditemukan')
    return { isValid: false, errors }
  }

  if (file.size > maxSize) {
    errors.push('Ukuran file harus kurang dari 5MB')
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Format file harus JPEG, PNG, GIF, atau WebP')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Convert file to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<Object>} - Promise resolving to base64 data and content type
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error('fileToBase64: No file provided')
      reject(new Error('No file provided'))
      return
    }

    console.log('fileToBase64: Converting file:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    const reader = new FileReader()
    
    reader.onload = () => {
      try {
        const result = reader.result
        console.log('fileToBase64: FileReader result length:', result.length)
        
        // Extract base64 data without data URI prefix (data:image/png;base64,)
        const base64Data = result.split(',')[1]
        
        const output = {
          data_base64: base64Data,
          content_type: file.type,
          file_size: file.size,
          file_name: file.name
        }
        
        console.log('fileToBase64: Conversion successful:', {
          content_type: output.content_type,
          data_length: output.data_base64.length,
          file_name: output.file_name,
          file_size: output.file_size
        })
        
        resolve(output)
      } catch (error) {
        console.error('fileToBase64: Error processing result:', error)
        reject(new Error('Failed to process file result'))
      }
    }
    
    reader.onerror = (error) => {
      console.error('fileToBase64: FileReader error:', error)
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Create a placeholder image URL for testing
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 300, text = 'No Image') => {
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/9ca3af?text=${encodeURIComponent(text)}`
}

// Export the base URL for other components that might need it
export { IMAGE_BASE_URL }
