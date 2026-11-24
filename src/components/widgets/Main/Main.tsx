import { Suspense } from 'react'
import clsx from 'clsx'
import CatalogPending from './CatalogPending'
import VacancyCatalog from './VacancyCatalog'
import styles from './Main.module.scss'

export default function Main() {
  return (
    <main className={clsx('main-container', styles.main)}>
      <h1 className={styles.title}>Вакансии и их прозрачность</h1>
      <p className={styles.intro}>
        Анализируем полноту и ясность описания условий работы
      </p>
      <Suspense fallback={<CatalogPending withSearch />}>
        <VacancyCatalog />
      </Suspense>
    </main>
  )
}
