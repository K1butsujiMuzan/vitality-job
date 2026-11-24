import Skeleton from '@/components/ui/Skeleton/Skeleton'
import { VACANCIES_CONFIG } from '@/shared/configs/vacancies.config'
import styles from './CatalogCards.module.scss'

export default function CatalogCardsSkeleton() {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {Array.from({ length: VACANCIES_CONFIG.PAGE_SIZE }, (_, index) => (
        <li key={index} className={styles.card}>
          <div>
            <Skeleton className={styles.titlePlaceholder} />
            <Skeleton className={styles.companyPlaceholder} />
          </div>
          <div className={styles.facts}>
            <div>
              <Skeleton className={styles.labelPlaceholder} />
              <Skeleton className={styles.salaryPlaceholder} />
            </div>
            <div>
              <Skeleton className={styles.labelPlaceholder} />
              <Skeleton className={styles.experiencePlaceholder} />
            </div>
          </div>
          <div className={styles.footer}>
            <Skeleton className={styles.badgePlaceholder} />
            <Skeleton className={styles.detailsPlaceholder} />
          </div>
        </li>
      ))}
    </ul>
  )
}
