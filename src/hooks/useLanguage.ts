import { useCallback, useEffect, useState } from 'react'
import type { Language } from '../i18n/translations'

export type { Language }

const STORAGE_KEY = 'spritz-language'

/**
 * Language hook — ref: spritz-reader.plan.md §6.5, spec US-09
 * Persists selection in localStorage; defaults to 'en'.
 */
export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (stored as Language | null) ?? 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  return { language, setLanguage }
}
