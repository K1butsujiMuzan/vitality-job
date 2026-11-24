import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { THEMES_CONFIG } from '@/shared/configs/themes.config'

export const useThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(
      resolvedTheme === THEMES_CONFIG.DARK
        ? THEMES_CONFIG.LIGHT
        : THEMES_CONFIG.DARK,
    )
  }, [resolvedTheme, setTheme])

  return {
    theme: resolvedTheme,
    toggleTheme,
  }
}
