import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@/components/ui/Button/Button'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import styles from './Vacancy.module.scss'

export default function CatalogMessage({
  title,
  retry,
}: {
  title: string
  retry?: () => void
}) {
  return (
    <main className={clsx('main-container', styles.main)}>
      <div className={styles.heading}>
        <h1>{title}</h1>
      </div>
      <div className={styles.breadcrumbs}>
        <Link href={PAGES_CONFIG.MAIN}>К списку вакансий</Link>
        {retry && (
          <Button variant="neutral" onClick={retry}>
            Повторить
          </Button>
        )}
      </div>
    </main>
  )
}
