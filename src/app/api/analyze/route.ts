import { analyzeVacancies } from '@/services/analysis/analyzeVacancies'
import { getModelConfig } from '@/services/analysis/modelClient'
import { readUpload, UploadError } from '@/services/analysis/readUpload'
import { resolveUpload } from '@/services/analysis/resolveUpload'
import { buildReport } from '@/services/reports/buildReport'
import { UPLOAD_CONFIG } from '@/shared/configs/upload.config'
import type { UploadAnalysisResponse } from '@/shared/types/analysis.type'

export async function POST(request: Request) {
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/json'
  ) {
    return Response.json(
      { error: 'Загрузите файл в формате JSON.' },
      { status: 415 },
    )
  }

  try {
    const upload = await readUpload(request)
    const model = getModelConfig(true)
    if (!model.loopback) {
      return Response.json(
        { error: 'Для анализа файла подключите локальную Ollama.' },
        { status: 503 },
      )
    }
    const signal = AbortSignal.any([
      request.signal,
      AbortSignal.timeout(UPLOAD_CONFIG.ANALYSIS_TIMEOUT_MS),
    ])
    const vacancy = await resolveUpload(upload, signal)
    const [entry] = await analyzeVacancies([vacancy], model, [], 1, signal)
    const report = buildReport({
      generatedAt: new Date().toISOString(),
      source: 'local-json',
      model: model.model,
      pages: 1,
      entries: [entry],
    })
    const data: UploadAnalysisResponse = {
      title: entry.vacancy.title,
      company: entry.vacancy.company,
      report,
    }
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof UploadError)
      return Response.json({ error: error.message }, { status: error.status })

    return Response.json(
      {
        error:
          'Не удалось проанализировать вакансию. Проверьте, запущена ли Ollama, и повторите попытку.',
      },
      { status: 503 },
    )
  }
}
