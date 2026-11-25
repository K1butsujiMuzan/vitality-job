import { fetchVacancy } from '@/services/trudvsem/fetchVacancy'
import { readVacancy } from '@/services/vacancies/readCatalog'
import { getAnalysisFields } from './analysisFields'
import { readUploadedVacancy, UploadError } from './readUpload'

export async function resolveUpload(
  upload: ReturnType<typeof readUploadedVacancy>,
  signal: AbortSignal,
) {
  if (upload.hasSourceFields) return upload.vacancy

  const saved = await readVacancy(upload.vacancy.id).catch(() => null)
  if (saved) return readUploadedVacancy(saved.vacancy).vacancy

  if (upload.reference) {
    const original = await fetchVacancy(upload.reference, signal).catch(() => {
      throw new UploadError(
        'Не удалось получить исходную вакансию с портала. Повторите попытку или загрузите исходный JSON.',
        503,
      )
    })
    if (original && Object.keys(getAnalysisFields(original)).length > 0)
      return original
  }

  throw new UploadError(
    'Это отчёт без текста вакансии. Исходная вакансия не найдена. Загрузите исходный JSON или отчёт со ссылкой на карточку «Работы в России».',
    404,
  )
}
