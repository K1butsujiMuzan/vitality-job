import { createHash } from 'node:crypto'
import { PROCESSING_CONFIG } from '@/shared/configs/processing.config'
import type { AnalyzedVacancy, Issue } from '@/shared/types/analysis.type'
import { normalizeVacancy } from '@/services/trudvsem/normalizeVacancy'
import type { SourceVacancy } from '@/services/trudvsem/trudvsem.schema'
import { getAnalysisFields } from './analysisFields'
import { checkIssues, mergeAnalysisIssues } from './checkIssues'
import { getModelIssues, type ModelConfig } from './modelClient'

export async function analyzeVacancies(
  vacancies: SourceVacancy[],
  model: ModelConfig,
  previous: AnalyzedVacancy[] = [],
  concurrency: number = model.loopback ? 1 : PROCESSING_CONFIG.CONCURRENCY,
  signal?: AbortSignal,
) {
  const cached = new Map(previous.map((item) => [item.vacancy.id, item]))
  const unique = [...new Map(vacancies.map((item) => [item.id, item])).values()]
  const result: AnalyzedVacancy[] = []
  const controller = new AbortController()
  const workSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal
  let next = 0

  async function worker() {
    while (next < unique.length) {
      workSignal.throwIfAborted()
      const index = next++
      const raw = unique[index]
      const fields = getAnalysisFields(raw)
      const fingerprint = createHash('sha256')
        .update(
          JSON.stringify([
            PROCESSING_CONFIG.ANALYZER_VERSION,
            model.baseUrl,
            model.model,
            Object.entries(fields).sort(),
          ]),
        )
        .digest('hex')
      const prior = cached.get(raw.id)
      let issues: Issue[]

      if (prior?.fingerprint === fingerprint) {
        issues = prior.issues
      } else {
        const existing = checkIssues(fields)
        const proposed = await getModelIssues(
          model,
          fields,
          existing,
          workSignal,
        )
        issues = mergeAnalysisIssues(fields, proposed, existing)
      }

      result[index] = { vacancy: normalizeVacancy(raw), issues, fingerprint }
    }
  }

  try {
    await Promise.all(
      Array.from({ length: Math.min(concurrency, unique.length) }, worker),
    )
    return result
  } catch (error) {
    controller.abort()
    throw error
  }
}
