'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LANG_COOKIE, LOCALES, THEME_COOKIE, dictionaries,
  type Dictionary, type Lang, type Theme,
} from './dictionaries'

interface Preferences {
  lang: Lang
  theme: Theme
  t: Dictionary
  locale: string
  setLang: (lang: Lang) => void
  setTheme: (theme: Theme) => void
}

const PreferencesContext = createContext<Preferences | null>(null)

function saveCookie(name: string, value: string, persistent = true) {
  // El tema oscuro dura solo la sesión del navegador: al volver a abrir, siempre se parte del modo claro.
  document.cookie = `${name}=${value}; path=/;${persistent ? ' max-age=31536000;' : ''} samesite=lax`
}

/** Idioma y tema del visitante. Los valores iniciales llegan del servidor (cookies) para evitar parpadeos. */
export function PreferencesProvider({ initialLang, initialTheme, children }: {
  initialLang: Lang; initialTheme: Theme; children: React.ReactNode
}) {
  const router = useRouter()
  const [lang, setLangState] = useState<Lang>(initialLang)
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  const setLang = useCallback((next: Lang) => {
    saveCookie(LANG_COOKIE, next)
    document.documentElement.lang = next
    setLangState(next)
    router.refresh() // vuelve a renderizar los componentes de servidor en el nuevo idioma
  }, [router])

  const setTheme = useCallback((next: Theme) => {
    saveCookie(THEME_COOKIE, next, false)
    document.documentElement.dataset.theme = next
    setThemeState(next)
  }, [])

  const value = useMemo<Preferences>(
    () => ({ lang, theme, t: dictionaries[lang], locale: LOCALES[lang], setLang, setTheme }),
    [lang, theme, setLang, setTheme],
  )
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePrefs(): Preferences {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePrefs debe usarse dentro de PreferencesProvider')
  return ctx
}
