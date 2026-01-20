export declare module '@/src/i18n' {
  export function useTranslation(): {
    t: (key: string, params?: Record<string, any>) => string
    changeLanguage: (locale: string) => void
    locale: string
    availableLanguages: Record<string, { name: string; code: string }>
  }
}
