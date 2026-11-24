import Link from 'next/link'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import styles from './Logo.module.scss'

const Logo = () => {
  return (
    <Link href={PAGES_CONFIG.MAIN} className={styles.logoLink}>
      <svg
        aria-hidden={'true'}
        className={styles.logoIcon}
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50.0737 18.995L40.4518 36.0201L34.2259 25.3266L43.2817 0C43.2817 0 46.6778 2.39196 48.0928 4.0804C51.4887 8.13266 52.116 15.4774 50.0737 18.995Z"
          fill="#6C38CC"
        />
        <path
          d="M23.1891 25.608L28 33.0653L32.811 25.608L28 18.1508L23.1891 25.608Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6C38CC"
        />
        <path
          d="M5.92636 18.995L15.5482 36.0201L21.7741 25.3266L12.7183 0C12.7183 0 9.32224 2.39196 7.90726 4.0804C4.51134 8.13266 3.884 15.4774 5.92636 18.995Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6C38CC"
        />
        <path
          d="M17.2462 40.2412L28 41.6482L38.7539 40.2412L40.7348 41.0854L42.1499 48.402H43.8478L42.9989 39.6784L39.3199 37.1457L33.6599 27.5779L28 36.0201L22.3401 27.5779L16.6802 37.1457L13.0013 39.6784L12.1523 48.402H13.8503L15.2652 41.0854L17.2462 40.2412Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6C38CC"
        />
        <path
          d="M6.77536 32.6432L14.1332 36.8643L11.8693 32.9246L9.32232 31.2362L7.90734 26.7337H6.49236L6.77536 32.6432Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6C38CC"
        />
        <path
          d="M41.8669 36.8643L49.2248 32.6432L49.5078 26.7337H48.0928L46.6778 31.2362L44.1308 32.9246L41.8669 36.8643Z"
          fill="#6C38CC"
        />
        <path
          d="M19.7932 42.4925L28 56L36.2069 42.4925L28 43.6181L19.7932 42.4925Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6C38CC"
        />
      </svg>
      <span>VitalityJob</span>
    </Link>
  )
}

export default Logo
