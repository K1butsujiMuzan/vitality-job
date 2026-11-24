import clsx from 'clsx'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

type Appearance = { variant?: 'primary' | 'outline' | 'neutral' }

export function Button({
  variant = 'primary',
  className,
  ...props
}: Appearance & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(styles.button, styles[variant], className)}
    />
  )
}

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: Appearance & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={clsx(styles.button, styles[variant], className)} />
  )
}
