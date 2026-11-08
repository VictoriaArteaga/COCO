import { cookies } from 'next/headers'
import { LANG_COOKIE, LOCALES, THEME_COOKIE, dictionaries, normalizeLang, normalizeTheme } from './dictionaries'

/** Preferencias del visitante leídas de cookies (claro y español por defecto). Sólo para componentes de servidor. */
export async function getServerPrefs() {
  const store = await cookies()
  const lang = normalizeLang(store.get(LANG_COOKIE)?.value)
  const theme = normalizeTheme(store.get(THEME_COOKIE)?.value)
  return { lang, theme, t: dictionaries[lang], locale: LOCALES[lang] }
}
