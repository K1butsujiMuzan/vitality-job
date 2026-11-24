import Logo from '@/components/ui/Logo/Logo'
import clsx from 'clsx'
import styles from './Header.module.scss'
import ThemeSwitch from '@/components/ui/ThemeSwitch/ThemeSwitch'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={clsx(styles.headerWrapper, 'main-container')}>
        <Logo />
        <ThemeSwitch />
      </div>
    </header>
  )
}

export default Header
