import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use service role key for server-side operations (bypasses RLS)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const BUCKET_NAME = 'YeetyBookPublic'

/**
 * Uploads a restaurant logo to Supabase Storage
 * @param restaurantId - The restaurant ID
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadRestaurantLogo(
  restaurantId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate a unique filename with timestamp to avoid caching issues
    const fileExt = file.name.split('.').pop()
    const fileName = `${restaurantId}/logo-${Date.now()}.${fileExt}`

    // Upload the file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('Error uploading logo:', error)
      return { url: null, error: error.message }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Unexpected error uploading logo:', error)
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Deletes a restaurant logo from Supabase Storage
 * @param logoUrl - The public URL of the logo to delete
 * @returns Success status
 */
export async function deleteRestaurantLogo(
  logoUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract the file path from the public URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = logoUrl.split(`/object/public/${BUCKET_NAME}/`)
    if (urlParts.length !== 2) {
      return { success: false, error: 'Invalid logo URL format' }
    }

    const filePath = urlParts[1]

    // Delete the file
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Error deleting logo:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting logo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Validates if a file is an acceptable image type and size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @returns Validation result
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error: string | null } {
  // Check file type
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be an image (JPEG, PNG, WebP, or GIF)',
    }
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    }
  }

  return { valid: true, error: null }
}
