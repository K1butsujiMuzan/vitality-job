import Link from 'next/link'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon/Icon'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import { VACANCIES_CONFIG } from '@/shared/configs/vacancies.config'
import type { VacancySummary } from '@/shared/types/vacancy.type'
import { formatExperience, formatSalary } from '@/utils/formatVacancy'
import styles from './CatalogCards.module.scss'

function VacancyCard({ vacancy }: { vacancy: VacancySummary }) {
  const { id, title, company, experience, issueCount } = vacancy
  const badgeColor =
    issueCount === 0
      ? styles.clean
      : issueCount >= VACANCIES_CONFIG.HIGH_ISSUE_COUNT
        ? styles.high
        : styles.flagged

  return (
    <li className={styles.card}>
      <div>
        <h2 className={styles.heading}>
          <Link
            href={PAGES_CONFIG.VACANCY(id)}
            prefetch={false}
            className={styles.title}
            title={title}
          >
            {title}
          </Link>
        </h2>
        {company && <p className={styles.company}>{company}</p>}
      </div>

      <dl className={styles.facts}>
        <div>
          <dt className={styles.label}>Зарплата</dt>
          <dd className={styles.salary}>{formatSalary(vacancy)}</dd>
        </div>
        <div>
          <dt className={styles.label}>Опыт работы</dt>
          <dd className={styles.experience}>
            {experience == null ? 'Не указан' : formatExperience(experience)}
          </dd>
        </div>
      </dl>

      <div className={styles.footer}>
        <span className={clsx(styles.badge, badgeColor)}>
          {issueCount > 0 ? `Замечания: ${issueCount}` : 'Нет замечаний'}
        </span>
        <span className={styles.details} aria-hidden="true">
          Подробнее <Icon name="chevron" size={16} />
        </span>
      </div>
    </li>
  )
}

export default function CatalogCards({
  vacancies,
}: {
  vacancies: VacancySummary[]
}) {
  return (
    <ul
      className={styles.grid}
      role="list"
      aria-label="Вакансии Калининградской области"
    >
      {vacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </ul>
  )
}
