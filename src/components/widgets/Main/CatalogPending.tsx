import Skeleton from '@/components/ui/Skeleton/Skeleton'
import CatalogCardsSkeleton from './CatalogCards/CatalogCardsSkeleton'
import CatalogSearchSkeleton from './CatalogSearch/CatalogSearchSkeleton'
import styles from './Main.module.scss'

export default function CatalogPending({
  withSearch = false,
}: {
  withSearch?: boolean
}) {
  return (
    <>
      <span className="visually-hidden" role="status">
        Загружаем вакансии…
      </span>
      {withSearch && <CatalogSearchSkeleton />}
      <div className={withSearch ? styles.results : undefined}>
        <Skeleton className={styles.countPlaceholder} />
        <CatalogCardsSkeleton />
      </div>
    </>
  )
}
