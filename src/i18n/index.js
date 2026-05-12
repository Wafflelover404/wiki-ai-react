import { useState, useEffect, useCallback } from 'react'

import en from './locales/en.json'
import ru from './locales/ru.json'

export const languages = {
  en: { name: 'English', code: 'en' },
  ru: { name: 'Русский', code: 'ru' }
}

export const defaultLocale = 'en'

const LOCALE_STORAGE_KEY = 'wiki-ai-locale'
const LOCALE_CHANGE_EVENT = 'wiki-ai-locale-change'

export const getStoredLocale = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || defaultLocale
  }
  return defaultLocale
}

export const storeLocale = (locale) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

export const getTranslations = (locale) => {
  switch (locale) {
    case 'ru':
      return ru
    case 'en':
    default:
      return en
  }
}

const listeners = new Set()

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function notify() {
  listeners.forEach((fn) => fn())
}

let cachedLocale
function resolveLocale() {
  if (!cachedLocale) cachedLocale = getStoredLocale()
  return cachedLocale
}

function setCachedLocale(locale) {
  cachedLocale = locale
  storeLocale(locale)
  notify()
}

export function useTranslation() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const stored = getStoredLocale()
    if (stored !== cachedLocale) {
      cachedLocale = stored
    }
    return subscribe(() => forceUpdate((n) => n + 1))
  }, [])

  const locale = resolveLocale()
  const translations = getTranslations(locale)

  const changeLanguage = useCallback((newLocale) => {
    setCachedLocale(newLocale)
  }, [])

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.')
    let value = getTranslations(cachedLocale || getStoredLocale())

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    if (typeof value === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        value = value.replace(`{{${param}}}`, params[param])
      })
    }

    return value || key
  }, [])

  return {
    locale,
    translations,
    t,
    changeLanguage,
    availableLanguages: languages
  }
}
