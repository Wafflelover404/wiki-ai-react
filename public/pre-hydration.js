// Pre-hydration script to remove browser extension attributes before React loads
(function() {
  'use strict';
  
  // Remove any bis_skin_checked attributes immediately
  function removeBisAttributes() {
    const elements = document.querySelectorAll('[bis_skin_checked]');
    elements.forEach(function(el) {
      if (el && el.removeAttribute) {
        el.removeAttribute('bis_skin_checked');
      }
    });
    
    // Also remove any other extension attributes
    const allElements = document.querySelectorAll('*');
    allElements.forEach(function(el) {
      if (el && el.attributes) {
        Array.from(el.attributes).forEach(function(attr) {
          if (attr.name && (
            attr.name.includes('bis_') || 
            attr.name.includes('skin_checked') ||
            attr.name.includes('processed_') ||
            attr.name.startsWith('__processed')
          )) {
            el.removeAttribute(attr.name);
          }
        });
      }
    });
  }
  
  // Run immediately
  removeBisAttributes();
  
  // Run multiple times to catch early injections
  setTimeout(removeBisAttributes, 0);
  setTimeout(removeBisAttributes, 10);
  setTimeout(removeBisAttributes, 50);
  setTimeout(removeBisAttributes, 100);
  setTimeout(removeBisAttributes, 500);
  
  // Set up a mutation observer to catch any new attributes
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          removeBisAttributes();
        }
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              removeBisAttributes();
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }
})();
