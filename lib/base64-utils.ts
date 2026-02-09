/**
 * Robust base64 decoding utilities
 * Handles common base64 encoding issues and provides safe decoding with proper error handling
 */

/**
 * Safely decode a base64 string with proper validation and padding
 * @param base64String The base64 string to decode
 * @returns The decoded string, or null if decoding fails
 */
export function safeBase64Decode(base64String: string): string | null {
  try {
    if (!base64String) return null

    let content = base64String

    // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
    if (content.includes(',')) {
      content = content.split(',')[1]
    }

    // Remove all whitespace (newlines, tabs, spaces)
    content = content.replace(/\s/g, '')

    // If content is empty after cleaning, return null
    if (!content) return null

    // Remove any invalid base64 characters but preserve structure
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(content)) {
      console.warn('Base64: Invalid characters detected, cleaning...')
      // Remove any non-base64 characters
      content = content.replace(/[^A-Za-z0-9+/=]/g, '')
    }

    // Fix padding: base64 strings must be multiple of 4
    while (content.length % 4 !== 0) {
      content += '='
    }

    // Validate the final string is valid base64
    if (!/^[A-Za-z0-9+/=]*$/.test(content)) {
      console.error('Base64: Final validation failed')
      return null
    }

    // Attempt to decode
    try {
      return atob(content)
    } catch (err) {
      console.error('Base64: atob() failed:', err)
      return null
    }
  } catch (err) {
    console.error('Base64: Unexpected error during decoding:', err)
    return null
  }
}

/**
 * Convert base64 string to Blob with specified MIME type
 * @param base64String The base64 string to convert
 * @param mimeType The MIME type for the blob
 * @returns The Blob, or null if conversion fails
 */
export function base64ToBlob(base64String: string, mimeType: string = 'application/octet-stream'): Blob | null {
  try {
    const binaryString = safeBase64Decode(base64String)
    if (!binaryString) return null

    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return new Blob([bytes], { type: mimeType })
  } catch (err) {
    console.error('Base64: Failed to convert to blob:', err)
    return null
  }
}

/**
 * Create an object URL from a base64 string
 * @param base64String The base64 string to convert
 * @param mimeType The MIME type for the blob
 * @returns The object URL, or null if creation fails
 */
export function base64ToObjectURL(base64String: string, mimeType: string = 'application/octet-stream'): string | null {
  try {
    const blob = base64ToBlob(base64String, mimeType)
    if (!blob) return null

    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('Base64: Failed to create object URL:', err)
    return null
  }
}

/**
 * Validate if a string is properly formatted base64
 * @param str The string to validate
 * @returns True if valid base64, false otherwise
 */
export function isValidBase64(str: string): boolean {
  try {
    if (!str) return false

    // Basic validation: should only contain base64 characters
    if (!/^[A-Za-z0-9+/=]*$/.test(str)) return false

    // Must be multiple of 4 in length (after adding padding)
    if ((str.replace(/=/g, '').length % 4) > 0) return false

    // Try to decode
    atob(str)
    return true
  } catch {
    return false
  }
}

/**
 * Get detailed error information for base64 decoding failures
 * @param base64String The base64 string that failed to decode
 * @returns A detailed error message
 */
export function getBase64ErrorDetails(base64String: string): string {
  if (!base64String) return 'Empty base64 string'

  if (!/^[A-Za-z0-9+/=]*$/.test(base64String)) {
    return 'Contains invalid base64 characters'
  }

  if (base64String.length % 4 !== 0) {
    return 'Length is not a multiple of 4 (invalid padding)'
  }

  return 'Unknown base64 format error'
}
