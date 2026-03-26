import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LocaleContext = createContext(null)

function detectLocale() {
  const saved = localStorage.getItem('wmfbd:locale')
  if (saved && translations[saved]) return saved
  const browser = navigator.language?.slice(0, 2).toLowerCase()
  return translations[browser] ? browser : 'en'
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(detectLocale)

  function changeLocale(code) {
    setLocale(code)
    localStorage.setItem('wmfbd:locale', code)
  }

  function t(key) {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
  }

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
