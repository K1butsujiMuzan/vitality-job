import clsx from 'clsx'
import styles from './Skeleton.module.scss'

export default function Skeleton({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={clsx(styles.skeleton, className)} />
  )
}
