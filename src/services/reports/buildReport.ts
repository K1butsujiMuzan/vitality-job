import type { AnalyzedVacancy, Snapshot } from '@/shared/types/analysis.type'

export function buildReport(
  snapshot: Snapshot,
  entries: AnalyzedVacancy[] = snapshot.entries,
) {
  return {
    version: 1,
    generatedAt: snapshot.generatedAt,
    source: snapshot.source,
    model: snapshot.model,
    pages: snapshot.pages,
    vacancies: entries.map(({ vacancy, issues }) => ({
      id: vacancy.id,
      url: vacancy.url,
      issues,
    })),
  }
}

export function downloadReport(snapshot: Snapshot, entry?: AnalyzedVacancy) {
  const filename = entry
    ? `vacancy-${entry.vacancy.id}.json`
    : 'vitality-job-report.json'
  return new Response(
    JSON.stringify(
      buildReport(snapshot, entry ? [entry] : undefined),
      null,
      2,
    ) + '\n',
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    },
  )
}
