import { timingSafeEqual } from 'node:crypto'
import { connection } from 'next/server'
import {
  ProcessingError,
  runProcessing,
} from '@/services/analysis/runProcessing'

export const maxDuration = 300

export async function GET(request: Request) {
  await connection()
  const secret = process.env.CRON_SECRET
  const header = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret ?? ''}`)
  if (
    !secret ||
    header.length !== expected.length ||
    !timingSafeEqual(header, expected)
  ) {
    return Response.json(
      { error: 'Требуется действующий CRON_SECRET.' },
      { status: 401 },
    )
  }

  try {
    const result = await runProcessing(
      AbortSignal.any([request.signal, AbortSignal.timeout(280_000)]),
    )
    return result
      ? Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
      : Response.json(
          {
            error:
              'Обновление уже запущено. Проверьте состояние хранилища при длительной задержке.',
          },
          { status: 409 },
        )
  } catch (error) {
    console.error('Сбой обработки вакансий:', error)
    const messages = {
      source: 'Не удалось загрузить вакансии из API «Работа в России».',
      analysis: 'Проверка вакансий не завершилась из-за ошибки ИИ.',
      storage: 'Не удалось прочитать или обновить хранилище.',
    }
    const stage = error instanceof ProcessingError ? error.stage : 'storage'
    return Response.json({ error: messages[stage] }, { status: 503 })
  }
}

export const POST = GET
