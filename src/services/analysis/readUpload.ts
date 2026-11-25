import { objectValue } from '@/services/trudvsem/sourceFields'
import { getVacancyReference } from '@/services/trudvsem/fetchVacancy'
import { SourceVacancySchema } from '@/services/trudvsem/trudvsem.schema'
import { UPLOAD_CONFIG } from '@/shared/configs/upload.config'
import { getAnalysisFields } from './analysisFields'
import { uploadVacancyFields } from './uploadVacancyFields'

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message)
  }
}

function unwrapVacancy(input: unknown, depth = 0): Record<string, unknown> {
  if (depth === 8)
    throw new UploadError('Не удалось определить структуру вакансии в JSON.')
  if (Array.isArray(input)) {
    if (input.length !== 1)
      throw new UploadError('В файле должна быть одна вакансия.')
    return unwrapVacancy(input[0], depth + 1)
  }
  const data = objectValue(input)
  const wrapper = ['vacancy', 'vacancies', 'results', 'data'].find(
    (key) =>
      Object.hasOwn(data, key) && data[key] && typeof data[key] === 'object',
  )
  return wrapper ? unwrapVacancy(data[wrapper], depth + 1) : data
}

export function readUploadedVacancy(input: unknown) {
  const fields = uploadVacancyFields(unwrapVacancy(input))
  const reference = getVacancyReference(fields.vac_url ?? fields.url)
  const id = fields.id ?? reference?.id
  const vacancy = SourceVacancySchema.parse({
    ...fields,
    id: id ?? 'uploaded-vacancy',
  })

  if (Object.keys(getAnalysisFields(vacancy)).length > 0)
    return { vacancy, hasSourceFields: true as const }
  if (!id)
    throw new UploadError(
      'В JSON нет данных вакансии, её ID или ссылки на «Работу в России».',
    )
  if (reference && reference.id !== vacancy.id)
    throw new UploadError('ID вакансии в JSON и в ссылке различаются.')
  return { vacancy, hasSourceFields: false as const, reference }
}

export async function readUpload(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) throw new UploadError('Выберите JSON-файл с вакансией.')

  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0
  let text = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > UPLOAD_CONFIG.MAX_FILE_BYTES) {
        await reader.cancel().catch(() => undefined)
        throw new UploadError(
          `Файл больше ${UPLOAD_CONFIG.MAX_FILE_KIB} КБ.`,
          413,
        )
      }
      text += decoder.decode(value, { stream: true })
    }
    return readUploadedVacancy(JSON.parse(text + decoder.decode()))
  } catch (error) {
    if (error instanceof UploadError) throw error
    throw new UploadError(
      'Не удалось прочитать вакансию. Проверьте структуру JSON и кодировку UTF-8.',
    )
  } finally {
    reader.releaseLock()
  }
}
