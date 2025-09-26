/**
 * Image Base64 Conversion Test
 * This file demonstrates how to convert images to base64 and send to API
 */

import { fileToBase64, validateImageFile } from '../utils/imageUtils.js'

// Test function for base64 conversion
export const testImageBase64Conversion = async () => {
  console.log('=== Image Base64 Conversion Test ===')
  
  // Create a file input for testing
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  return new Promise((resolve) => {
    input.onchange = async (event) => {
      const file = event.target.files[0]
      
      if (!file) {
        console.log('No file selected')
        resolve()
        return
      }
      
      console.log('Selected file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      })
      
      // Validate file
      const validation = validateImageFile(file)
      console.log('Validation result:', validation)
      
      if (!validation.isValid) {
        console.error('Validation failed:', validation.errors)
        resolve()
        return
      }
      
      try {
        // Convert to base64
        const base64Result = await fileToBase64(file)
        console.log('Base64 conversion result:', base64Result)
        
        // Simulate API payload
        const apiPayload = {
          item_name: "Test Product",
          price: 99.99,
          description: "Test product with image",
          image_base64: base64Result.data_base64,
          image_type: base64Result.content_type
        }
        
        console.log('API Payload (excluding base64 data):', {
          ...apiPayload,
          image_base64: `[${apiPayload.image_base64.length} characters]`
        })
        
        // Test reconstructing data URI
        const dataUri = `data:${base64Result.content_type};base64,${base64Result.data_base64}`
        console.log('Reconstructed data URI length:', dataUri.length)
        
        // Display the image for verification
        const img = document.createElement('img')
        img.src = dataUri
        img.style.maxWidth = '200px'
        img.style.border = '1px solid #ccc'
        img.onload = () => {
          console.log('✅ Image successfully loaded from base64 data')
          console.log('Image dimensions:', img.naturalWidth + 'x' + img.naturalHeight)
        }
        document.body.appendChild(img)
        
        resolve(base64Result)
      } catch (error) {
        console.error('❌ Base64 conversion failed:', error)
        resolve()
      }
    }
    
    // Trigger file selection
    input.click()
  })
}

// Example usage in console:
// import { testImageBase64Conversion } from './path/to/this/file'
// testImageBase64Conversion()

export default testImageBase64Conversion
