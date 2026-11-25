import { ButtonLink } from '@/components/ui/Button/Button'
import Icon from '@/components/ui/Icon/Icon'
import VacancyAnalysis from '@/components/widgets/Vacancy/VacancyAnalysis'
import VacancyRecommendations from '@/components/widgets/Vacancy/VacancyRecommendations'
import type { UploadAnalysisResponse } from '@/shared/types/analysis.type'
import styles from './Analyze.module.scss'

export default function UploadResult({
  data,
}: {
  data: UploadAnalysisResponse
}) {
  const { report, title, company } = data
  const issues = report.vacancies[0].issues
  const downloadUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`
  return (
    <section className={styles.result} aria-label="Результат анализа">
      <p className={styles.model} role="status">
        Анализ завершён · {report.model}
      </p>
      <div className={styles.resultHeader}>
        <div className={styles.resultTitle}>
          <h2>{title}</h2>
          {company && <p className={styles.hint}>{company}</p>}
        </div>
        <ButtonLink
          variant="outline"
          href={downloadUrl}
          download="vitality-job-upload-report.json"
        >
          <Icon name="download" size={18} /> Скачать отчёт JSON
        </ButtonLink>
      </div>
      <div className={styles.resultGrid}>
        <VacancyAnalysis issues={issues} analyzedAt={report.generatedAt} />
        <VacancyRecommendations issues={issues} />
      </div>
    </section>
  )
}
