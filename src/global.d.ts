/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '@/src/i18n' {
  export function useTranslation(): {
    t: (key: string, params?: Record<string, any>) => string
    changeLanguage: (locale: string) => void
    locale: string
    availableLanguages: Record<string, { name: string; code: string }>
  }
}

declare module '@/*' {
  // Allow any module imports
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom elements if needed
    }
  }
}
