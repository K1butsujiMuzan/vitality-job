import clsx from 'clsx'
import Link from 'next/link'
import { Button, ButtonLink } from '@/components/ui/Button/Button'
import Icon from '@/components/ui/Icon/Icon'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import type { VacancyResponse } from '@/shared/types/analysis.type'
import VacancyAnalysis from './VacancyAnalysis'
import VacancyContacts from './VacancyContacts'
import VacancyDescription from './VacancyDescription'
import VacancyFacts from './VacancyFacts'
import VacancyRecommendations from './VacancyRecommendations'
import styles from './Vacancy.module.scss'

export default function VacancyPage({ data }: { data: VacancyResponse }) {
  const { vacancy, issues, analyzedAt, mode } = data

  return (
    <main className={clsx('main-container', styles.main)}>
      <nav className={styles.breadcrumbs} aria-label="Навигационная цепочка">
        <Link href={PAGES_CONFIG.MAIN}>Вакансии</Link>
        <Icon name="chevron" size={16} />
        <span aria-current="page">{vacancy.title}</span>
      </nav>
      <div className={styles.heading}>
        <h1>{vacancy.title}</h1>
        {(vacancy.company || vacancy.source) && (
          <div className={styles.byline}>
            {vacancy.company && <span>{vacancy.company}</span>}
            {vacancy.company && vacancy.source && (
              <span className={styles.separator} aria-hidden="true" />
            )}
            {vacancy.source && <span>{vacancy.source}</span>}
          </div>
        )}
      </div>

      <div className={styles.layout}>
        <div className={styles.details}>
          <VacancyFacts vacancy={vacancy} />
          <VacancyDescription vacancy={vacancy} />
        </div>
        <aside
          className={styles.sidebar}
          aria-label="Отклик и отчёт о вакансии"
        >
          <div className={styles.actions}>
            {vacancy.url ? (
              <ButtonLink
                href={vacancy.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Откликнуться
                <span className="visually-hidden">
                  {' '}
                  (откроется в новой вкладке)
                </span>
              </ButtonLink>
            ) : (
              <>
                <Button disabled>Откликнуться</Button>
                <p className={styles.actionNote}>
                  Ссылка для отклика отсутствует.
                </p>
              </>
            )}
            <ButtonLink
              variant="outline"
              href={`/api/reports?id=${encodeURIComponent(vacancy.id)}`}
              download
            >
              <Icon name="download" size={19} /> Экспортировать JSON
            </ButtonLink>
          </div>
          <VacancyContacts vacancy={vacancy} />
          <VacancyAnalysis issues={issues} analyzedAt={analyzedAt} />
          <VacancyRecommendations issues={issues} />
          {mode === 'live' && (
            <p className={styles.attribution}>
              Источник <a href="https://trudvsem.ru/">«Работа в России»</a>
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}
