import { UPLOAD_CONFIG } from '@/shared/configs/upload.config'
import type { UploadAnalysisResponse } from '@/shared/types/analysis.type'

export async function analyzeUpload(
  file: File,
): Promise<UploadAnalysisResponse> {
  if (file.size > UPLOAD_CONFIG.MAX_FILE_BYTES)
    throw new Error(`Файл больше ${UPLOAD_CONFIG.MAX_FILE_KIB} КБ.`)

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: file,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data)
    throw new Error(
      data?.error ?? 'Не удалось получить отчёт. Повторите попытку.',
    )
  return data
}
