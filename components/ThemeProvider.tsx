'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeId } from '@/lib/theme'

const ThemeContext = createContext<{
  theme: ThemeId
  setTheme: (t: ThemeId) => void
}>({ theme: 'default', setTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('default')

  useEffect(() => {
    const saved = localStorage.getItem('mbs_theme') as ThemeId | null
    if (saved) apply(saved)
  }, [])

  const apply = (t: ThemeId) => {
    document.documentElement.setAttribute('data-theme', t)
    setThemeState(t)
  }

  const setTheme = (t: ThemeId) => {
    localStorage.setItem('mbs_theme', t)
    apply(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
