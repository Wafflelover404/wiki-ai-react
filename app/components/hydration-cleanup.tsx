'use client'

import { useEffect } from 'react'

export default function HydrationCleanup() {
  useEffect(() => {
    // Remove any browser extension added attributes that cause hydration mismatch
    const body = document.body
    if (body.hasAttribute('__processed_e5f10ced-41c6-44a1-872f-d8ea8b373b81__')) {
      body.removeAttribute('__processed_e5f10ced-41c6-44a1-872f-d8ea8b373b81__')
    }
    if (body.hasAttribute('bis_register')) {
      body.removeAttribute('bis_register')
    }
    
    // Also check for any other data-* attributes that might be added by extensions
    const attributes = body.attributes
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i]
      if (attr.name.startsWith('data-') && (
        attr.name.includes('processed') || 
        attr.name.includes('bis_') ||
        attr.name.includes('extension')
      )) {
        body.removeAttribute(attr.name)
      }
    }
  }, [])

  return null
}
