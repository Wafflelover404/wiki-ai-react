// i18n configuration and utilities
import { useState, useEffect } from 'react'

// Import translations
import en from './locales/en.json'
import ru from './locales/ru.json'

// Available languages
export const languages = {
  en: { name: 'English', code: 'en' },
  ru: { name: 'Русский', code: 'ru' }
}

// Default locale
export const defaultLocale = 'en'

// Local storage key
const LOCALE_STORAGE_KEY = 'wiki-ai-locale'

// Get current locale from storage
export const getStoredLocale = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || defaultLocale
  }
  return defaultLocale
}

// Store locale in storage
export const storeLocale = (locale) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

// Get translations for a locale
export const getTranslations = (locale) => {
  switch (locale) {
    case 'ru':
      return ru
    case 'en':
    default:
      return en
  }
}

// Main translation hook
export function useTranslation() {
  const [locale, setLocale] = useState(defaultLocale)
  const [translations, setTranslations] = useState(() => getTranslations(defaultLocale))

  useEffect(() => {
    const storedLocale = getStoredLocale()
    if (storedLocale !== locale) {
      setLocale(storedLocale)
      setTranslations(getTranslations(storedLocale))
    }
  }, [])

  const changeLanguage = (newLocale) => {
    setLocale(newLocale)
    storeLocale(newLocale)
    setTranslations(getTranslations(newLocale))
  }

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Key not found
      }
    }
    
    // Handle parameter interpolation
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        value = value.replace(`{{${param}}}`, params[param])
      })
    }
    
    return value || key
  }

  return {
    locale,
    translations,
    t,
    changeLanguage,
    availableLanguages: languages
  }
}
