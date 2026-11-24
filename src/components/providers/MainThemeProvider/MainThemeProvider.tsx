import React from 'react'
import { ThemeProvider } from 'next-themes'
import { THEMES_CONFIG } from '@/shared/configs/themes.config'
import { LOCAL_STORAGE_CONFIG } from '@/shared/configs/local-storage.config'

type Props = {
  children: Readonly<React.ReactNode>
}

const MainThemeProvider = ({ children }: Props) => {
  return (
    <ThemeProvider
      themes={[THEMES_CONFIG.DARK, THEMES_CONFIG.LIGHT]}
      enableSystem={true}
      defaultTheme={THEMES_CONFIG.SYSTEM}
      enableColorScheme={true}
      attribute={'class'}
      storageKey={LOCAL_STORAGE_CONFIG.THEME}
      disableTransitionOnChange={true}
    >
      {children}
    </ThemeProvider>
  )
}

export default MainThemeProvider
