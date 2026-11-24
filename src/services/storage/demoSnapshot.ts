import vacancies from '../../../examples/vacancies.json'
import report from '../../../examples/report.json'
import type { Issue, Snapshot } from '@/shared/types/analysis.type'
import { normalizeVacancy } from '@/services/trudvsem/normalizeVacancy'
import { readSourcePages } from '@/services/trudvsem/trudvsem.schema'

export function getDemoSnapshot(): Snapshot {
  const issues = new Map(
    report.vacancies.map((vacancy) => [vacancy.id, vacancy.issues as Issue[]]),
  )

  return {
    generatedAt: report.generatedAt,
    model: report.model,
    source: report.source,
    pages: report.pages,
    entries: readSourcePages(vacancies).flatMap((page) =>
      page.results.vacancies.map(({ vacancy }) => ({
        vacancy: normalizeVacancy(vacancy),
        issues: issues.get(vacancy.id) ?? [],
        fingerprint: '',
      })),
    ),
  }
}
