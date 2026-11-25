import { Suspense } from 'react'
import clsx from 'clsx'
import { ButtonLink } from '@/components/ui/Button/Button'
import Icon from '@/components/ui/Icon/Icon'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import CatalogPending from './CatalogPending'
import VacancyCatalog from './VacancyCatalog'
import styles from './Main.module.scss'

export default function Main() {
  return (
    <main className={clsx('main-container', styles.main)}>
      <h1 className={styles.title}>Вакансии и их прозрачность</h1>
      <div className={styles.introRow}>
        <p className={styles.intro}>
          Анализируем полноту и ясность описания условий работы
        </p>
        <ButtonLink href={PAGES_CONFIG.ANALYZE} variant="outline">
          <Icon name="upload" size={18} /> Проверить свой JSON
        </ButtonLink>
      </div>
      <Suspense fallback={<CatalogPending withSearch />}>
        <VacancyCatalog />
      </Suspense>
    </main>
  )
}
