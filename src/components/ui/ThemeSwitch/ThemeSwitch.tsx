'use client'

import { useId } from 'react'
import {
  ThemeMoonIcon,
  ThemeSunIcon,
} from '@/components/ui/ThemeSwitch/ThemeIcons'
import { THEMES_CONFIG } from '@/shared/configs/themes.config'
import clsx from 'clsx'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useThemeSwitch } from '@/components/ui/ThemeSwitch/useThemeSwitch'
import styles from './ThemeSwitch.module.scss'

const ThemeSwitch = () => {
  const id = useId()
  const { theme, toggleTheme } = useThemeSwitch()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return <span className={styles.themeLabelLoader} />
  }

  return (
    <label htmlFor={id} className={styles.themeLabel} role={'switch'}>
      <input
        checked={theme === THEMES_CONFIG.DARK}
        type={'checkbox'}
        onChange={toggleTheme}
        id={id}
        className={clsx(styles.themeInput, 'visually-hidden')}
      />
      <span className={styles.themeOval}>
        <ThemeSunIcon />
        <ThemeMoonIcon />
      </span>
    </label>
  )
}

export default ThemeSwitch
