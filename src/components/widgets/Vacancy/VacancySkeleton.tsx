import clsx from 'clsx'
import Skeleton from '@/components/ui/Skeleton/Skeleton'
import styles from './Vacancy.module.scss'
import pending from './VacancySkeleton.module.scss'

export default function VacancySkeleton() {
  return (
    <main className={clsx('main-container', styles.main)}>
      <span className="visually-hidden" role="status">
        Загружаем вакансию…
      </span>
      <div aria-hidden="true">
        <div className={styles.breadcrumbs}>
          <Skeleton className={pending.breadcrumb} />
        </div>
        <div className={styles.heading}>
          <Skeleton className={pending.title} />
          <Skeleton className={pending.company} />
        </div>
        <div className={styles.layout}>
          <div className={styles.details}>
            <div className={styles.facts}>
              {Array.from({ length: 8 }, (_, index) => (
                <div className={styles.fact} key={index}>
                  <Skeleton className={pending.icon} />
                  <div className={pending.factText}>
                    <Skeleton className={pending.label} />
                    <Skeleton className={pending.value} />
                  </div>
                </div>
              ))}
            </div>
            {Array.from({ length: 2 }, (_, index) => (
              <div className={clsx(styles.card, pending.card)} key={index}>
                <Skeleton className={pending.label} />
                <Skeleton />
                <Skeleton className={pending.shortLine} />
              </div>
            ))}
          </div>
          <div className={styles.sidebar}>
            <div className={styles.actions}>
              <Skeleton className={pending.button} />
              <Skeleton className={pending.button} />
            </div>
            <div className={clsx(styles.card, pending.card)}>
              <Skeleton className={pending.label} />
              <Skeleton />
              <Skeleton className={pending.shortLine} />
            </div>
            <div className={clsx(styles.analysis, pending.card)}>
              <Skeleton className={pending.label} />
              <Skeleton />
              <Skeleton className={pending.shortLine} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
