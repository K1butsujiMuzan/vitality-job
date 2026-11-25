import clsx from 'clsx'
import Link from 'next/link'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import VacancyUpload from './VacancyUpload'
import styles from './Analyze.module.scss'

export default function Analyze() {
  return (
    <main className={clsx('main-container', styles.main)}>
      <Link className={styles.back} href={PAGES_CONFIG.MAIN}>
        К каталогу вакансий
      </Link>
      <h1 className={styles.title}>Проверить свой JSON</h1>
      <p className={styles.intro}>
        Загрузите одну вакансию. Локальная модель проверит описание условий
        работы и предложит уточнения.
      </p>
      <VacancyUpload />
    </main>
  )
}
