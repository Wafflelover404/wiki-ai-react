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
    
    // Remove bis_skin_checked attributes from all elements
    const elementsWithBisAttr = document.querySelectorAll('[bis_skin_checked]')
    elementsWithBisAttr.forEach(el => {
      if (el instanceof HTMLElement) {
        el.removeAttribute('bis_skin_checked')
      }
    })
    
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

    // Set up a mutation observer to catch any dynamically added attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement
          if (target.hasAttribute('bis_skin_checked')) {
            target.removeAttribute('bis_skin_checked')
          }
        }
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes)
          addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              if (element.hasAttribute && element.hasAttribute('bis_skin_checked')) {
                element.removeAttribute('bis_skin_checked')
              }
            }
          })
        }
      })
    })

    // Start observing the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['bis_skin_checked']
    })

    // Cleanup observer on unmount
    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
