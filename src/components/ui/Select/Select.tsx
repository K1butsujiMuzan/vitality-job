import clsx from 'clsx'
import type { SelectHTMLAttributes } from 'react'
import Icon from '@/components/ui/Icon/Icon'
import styles from './Select.module.scss'

export default function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={clsx(styles.control, className)}>
      <select className={styles.select} {...props}>
        {children}
      </select>
      <span className={styles.chevron} aria-hidden="true">
        <Icon name="chevron" size={16} />
      </span>
    </span>
  )
}
