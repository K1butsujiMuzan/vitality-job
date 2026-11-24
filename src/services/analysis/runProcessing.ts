import { z } from 'zod'
import { PROCESSING_CONFIG } from '@/shared/configs/processing.config'
import { fetchVacancies } from '@/services/trudvsem/fetchVacancies'
import {
  acquireLease,
  readSnapshot,
  recordFailure,
  saveSnapshot,
} from '@/services/storage/snapshotStore'
import { analyzeVacancies } from './analyzeVacancies'
import { getModelConfig } from './modelClient'

export class ProcessingError extends Error {
  constructor(
    public readonly stage: 'source' | 'analysis' | 'storage',
    cause: unknown,
  ) {
    super('Не удалось обновить каталог.', { cause })
  }
}

export async function runProcessing(signal?: AbortSignal) {
  const token = await acquireLease()
  if (!token) return null

  let stage: ProcessingError['stage'] = 'storage'
  try {
    const { snapshot: previous } = await readSnapshot()
    stage = 'source'
    const source = z
      .url({ protocol: /^https?$/ })
      .parse(process.env.VACANCIES_SOURCE_URL || PROCESSING_CONFIG.SOURCE_URL)
    const limit = z.coerce
      .number()
      .int()
      .min(1)
      .max(PROCESSING_CONFIG.MAX_LIMIT)
      .parse(process.env.VACANCIES_LIMIT || PROCESSING_CONFIG.DEFAULT_LIMIT)
    const { vacancies, pages } = await fetchVacancies(source, limit, signal)

    stage = 'analysis'
    const model = getModelConfig()
    const entries = await analyzeVacancies(
      vacancies,
      model,
      previous?.entries,
      undefined,
      signal,
    )
    const snapshot = {
      generatedAt: new Date().toISOString(),
      source,
      model: model.model,
      pages,
      entries,
    }

    stage = 'storage'
    await saveSnapshot(token, snapshot)
    return { count: entries.length, pages, generatedAt: snapshot.generatedAt }
  } catch (error) {
    await recordFailure(token).catch((storageError) => {
      console.error('Не удалось сохранить время сбоя обновления:', storageError)
    })
    throw new ProcessingError(stage, error)
  }
}
