"use client"

import { useEffect } from "react"

export function HydrationFix() {
  useEffect(() => {
    // Remove any attributes added by browser extensions that might cause hydration mismatches
    const body = document.body
    const html = document.documentElement
    
    // Remove common extension attributes
    const extensionAttrs = [
      'bis_register', 
      '__processed_*',
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'data-lt-installed'
    ]
    
    const removeExtensionAttrs = (element: HTMLElement) => {
      const attrs = Array.from(element.attributes)
      attrs.forEach(attr => {
        if (extensionAttrs.some(pattern => {
          if (pattern.includes('*')) {
            return attr.name.startsWith(pattern.replace('*', ''))
          }
          return attr.name === pattern
        })) {
          element.removeAttribute(attr.name)
        }
      })
    }
    
    removeExtensionAttrs(body)
    removeExtensionAttrs(html)
  }, [])

  return null
}
