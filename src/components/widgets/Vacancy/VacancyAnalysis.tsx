import {
  ANALYSIS_TOPICS,
  ISSUE_KINDS,
} from '@/shared/constants/analysis.constant'
import type { Issue } from '@/shared/types/analysis.type'
import { formatDate } from '@/utils/formatVacancy'
import { formatEvidence } from './formatEvidence'
import styles from './Vacancy.module.scss'

export default function VacancyAnalysis({
  issues,
  analyzedAt,
}: {
  issues: Issue[]
  analyzedAt: string
}) {
  return (
    <section className={styles.analysis}>
      <h2 className={styles.sectionTitle}>Возможные недостатки</h2>
      {issues.length ? (
        <ul className={styles.issueList}>
          {issues.map((issue, index) => (
            <li className={styles.issue} key={index}>
              <h3>
                {ANALYSIS_TOPICS[issue.topic]}{' '}
                <span>· {ISSUE_KINDS[issue.kind]}</span>
              </h3>
              <p>{issue.problem}</p>
              <dl className={styles.evidence} aria-label="Сведения из вакансии">
                {issue.evidence.map((source, evidenceIndex) => {
                  const { label, value, quoted } = formatEvidence(source)
                  return (
                    <div key={evidenceIndex}>
                      <dt>{label}</dt>
                      <dd>{quoted ? <q>{value}</q> : value}</dd>
                    </div>
                  )
                })}
              </dl>
              <p>
                <strong>Рекомендация</strong>
                <br />
                {issue.recommendation}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет замечаний по проверенным условиям.</p>
      )}
      <p className={styles.analysisDate}>Отчёт от {formatDate(analyzedAt)}</p>
    </section>
  )
}
