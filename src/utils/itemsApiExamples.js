/**
 * Items API Usage Examples
 * Demonstrates how to use the Items API with base64 image upload
 * Based on items_api.md specification
 */

import itemsService from '../services/itemsService.js'
import { fileToBase64, validateImageFile } from '../utils/imageUtils.js'

/**
 * Example 1: Create item with base64 image
 */
export const createItemWithBase64Image = async (file, itemData) => {
  console.log('=== Creating Item with Base64 Image ===')
  
  try {
    // Step 1: Validate the image file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      throw new Error('Invalid image file: ' + validation.errors.join(', '))
    }
    
    // Step 2: Convert file to base64
    console.log('Converting image to base64...')
    const imageData = await fileToBase64(file)
    
    // Step 3: Prepare API payload according to items_api.md
    const apiPayload = {
      item_name: itemData.name,              // Required
      price: parseFloat(itemData.price),     // Required
      item_type: itemData.type || '',        // Optional
      is_available: itemData.isAvailable !== false, // Optional (default: true)
      description: itemData.description || '', // Optional
      image_base64: imageData.data_base64,   // Optional (base64 without data URI prefix)
      image_type: imageData.content_type     // Required when image_base64 is provided
    }
    
    console.log('API Payload:', {
      ...apiPayload,
      image_base64: `[${apiPayload.image_base64.length} chars]`
    })
    
    // Step 4: Send to API
    const result = await itemsService.create(apiPayload)
    
    if (result.success) {
      console.log('✅ Item created successfully!')
      console.log('Created item:', result.data)
      console.log('Server generated image_url:', result.data.image_url)
      return result.data
    } else {
      throw new Error(result.error || 'Failed to create item')
    }
    
  } catch (error) {
    console.error('❌ Failed to create item:', error)
    throw error
  }
}

/**
 * Example 2: Create item with image URL (external)
 */
export const createItemWithImageUrl = async (itemData) => {
  console.log('=== Creating Item with Image URL ===')
  
  try {
    const apiPayload = {
      item_name: itemData.name,
      price: parseFloat(itemData.price),
      item_type: itemData.type || '',
      is_available: itemData.isAvailable !== false,
      description: itemData.description || '',
      image_url: itemData.imageUrl  // External URL or custom filename
    }
    
    console.log('API Payload:', apiPayload)
    
    const result = await itemsService.create(apiPayload)
    
    if (result.success) {
      console.log('✅ Item created successfully!')
      console.log('Created item:', result.data)
      return result.data
    } else {
      throw new Error(result.error || 'Failed to create item')
    }
    
  } catch (error) {
    console.error('❌ Failed to create item:', error)
    throw error
  }
}

/**
 * Example 3: Update item with new base64 image
 */
export const updateItemWithBase64Image = async (itemId, file, updateData) => {
  console.log('=== Updating Item with Base64 Image ===')
  
  try {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      throw new Error('Invalid image file: ' + validation.errors.join(', '))
    }
    
    const imageData = await fileToBase64(file)
    
    const apiPayload = {
      ...updateData,
      image_base64: imageData.data_base64,
      image_type: imageData.content_type
    }
    
    console.log('Update payload:', {
      ...apiPayload,
      image_base64: `[${apiPayload.image_base64.length} chars]`
    })
    
    const result = await itemsService.update(itemId, apiPayload)
    
    if (result.success) {
      console.log('✅ Item updated successfully!')
      console.log('Updated item:', result.data)
      return result.data
    } else {
      throw new Error(result.error || 'Failed to update item')
    }
    
  } catch (error) {
    console.error('❌ Failed to update item:', error)
    throw error
  }
}

/**
 * Example usage in Vue component:
 * 
 * <script setup>
 * import { createItemWithBase64Image } from '@/utils/itemsApiExamples'
 * 
 * const handleFileUpload = async (event) => {
 *   const file = event.target.files[0]
 *   const itemData = {
 *     name: "My Product",
 *     price: 99.99,
 *     type: "electronics",
 *     description: "A great product",
 *     isAvailable: true
 *   }
 *   
 *   try {
 *     const createdItem = await createItemWithBase64Image(file, itemData)
 *     console.log('Item created:', createdItem)
 *   } catch (error) {
 *     console.error('Error:', error)
 *   }
 * }
 * </script>
 */

/**
 * Complete workflow example
 */
export const completeImageUploadWorkflow = async () => {
  console.log('=== Complete Image Upload Workflow ===')
  
  // This would typically be triggered by user interaction
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  return new Promise((resolve) => {
    input.onchange = async (event) => {
      const file = event.target.files[0]
      
      if (!file) {
        resolve(null)
        return
      }
      
      try {
        const itemData = {
          name: "Test Product " + Date.now(),
          price: 29.99,
          type: "test",
          description: "Test product created via API",
          isAvailable: true
        }
        
        const createdItem = await createItemWithBase64Image(file, itemData)
        
        console.log('=== Workflow Complete ===')
        console.log('Original file:', file.name)
        console.log('Created item ID:', createdItem.id_item)
        console.log('Generated image filename:', createdItem.image_url)
        console.log('Full server image path would be: /storage/images/' + createdItem.image_url)
        
        resolve(createdItem)
        
      } catch (error) {
        console.error('Workflow failed:', error)
        resolve(null)
      }
    }
    
    input.click()
  })
}

export default {
  createItemWithBase64Image,
  createItemWithImageUrl,
  updateItemWithBase64Image,
  completeImageUploadWorkflow
}
