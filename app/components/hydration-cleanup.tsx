"use client"

import { useEffect } from 'react'

export default function HydrationCleanup() {
  useEffect(() => {
    // Run cleanup immediately and multiple times to catch early extension injections
    const cleanupExtensionAttributes = () => {
      // Remove bis_skin_checked from all elements in the entire document
      const elementsWithBisAttr = document.querySelectorAll('[bis_skin_checked]')
      elementsWithBisAttr.forEach(el => {
        if (el instanceof HTMLElement) {
          el.removeAttribute('bis_skin_checked')
        }
      })

      // Also check for any other extension attributes
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Remove any attribute that looks like it's from a browser extension
          Array.from(el.attributes).forEach(attr => {
            if (attr.name.includes('bis_') || 
                attr.name.includes('skin_checked') ||
                attr.name.includes('processed_') ||
                attr.name.startsWith('__processed')) {
              el.removeAttribute(attr.name)
            }
          })
        }
      })
    }

    // Run immediately
    cleanupExtensionAttributes()
    
    // Run again after a short delay to catch delayed injections
    const timeout1 = setTimeout(cleanupExtensionAttributes, 50)
    const timeout2 = setTimeout(cleanupExtensionAttributes, 200)
    const timeout3 = setTimeout(cleanupExtensionAttributes, 500)
    
    // Set up a more aggressive mutation observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement
          cleanupExtensionAttributes()
        }
        if (mutation.type === 'childList') {
          // Clean up any new nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              Array.from(element.attributes || []).forEach(attr => {
                if (attr.name.includes('bis_') || 
                    attr.name.includes('skin_checked') ||
                    attr.name.includes('processed_') ||
                    attr.name.startsWith('__processed')) {
                  element.removeAttribute(attr.name)
                }
              })
            }
          })
        }
      })
    })

    // Start observing the entire document
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['bis_skin_checked', 'bis_', 'processed_', '__processed']
    })

    // Cleanup function
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      observer.disconnect()
    }
  }, [])

  return null
}
