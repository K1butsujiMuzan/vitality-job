import { ANALYSIS_TOPICS } from '@/shared/constants/analysis.constant'
import type { Issue } from '@/shared/types/analysis.type'
import styles from './Vacancy.module.scss'

export default function VacancyRecommendations({
  issues,
}: {
  issues: Issue[]
}) {
  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>Как исправить замечания</h2>
      {issues.length ? (
        <ol className={styles.recommendations}>
          {issues.map(({ topic, recommendation }, index) => (
            <li className={styles.issue} key={index}>
              <h3>{ANALYSIS_TOPICS[topic]}</h3>
              <p>{recommendation}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p>По результатам проверки правки не требуются.</p>
      )}
    </section>
  )
}
