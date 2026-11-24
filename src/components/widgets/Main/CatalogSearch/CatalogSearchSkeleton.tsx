import Skeleton from '@/components/ui/Skeleton/Skeleton'
import styles from './CatalogSearch.module.scss'

export default function CatalogSearchSkeleton() {
  return (
    <div className={styles.bar} aria-hidden="true">
      <Skeleton className={styles.searchPlaceholder} />
      <Skeleton className={styles.filterPlaceholder} />
      <Skeleton className={styles.submitPlaceholder} />
    </div>
  )
}
