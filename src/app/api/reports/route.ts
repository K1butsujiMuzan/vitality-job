import { connection, type NextRequest } from 'next/server'
import { downloadReport } from '@/services/reports/buildReport'
import { getCatalogSnapshot } from '@/services/vacancies/readCatalog'

export async function GET(request: NextRequest) {
  await connection()
  const id = request.nextUrl.searchParams.get('id')
  try {
    const { snapshot } = await getCatalogSnapshot()
    if (!snapshot)
      return Response.json(
        { error: 'Отчёт ещё не сформирован.' },
        { status: 404 },
      )

    const entry =
      id === null
        ? undefined
        : snapshot.entries.find(({ vacancy }) => vacancy.id === id)
    if (id !== null && !entry)
      return Response.json({ error: 'Вакансия не найдена.' }, { status: 404 })
    return downloadReport(snapshot, entry)
  } catch (error) {
    console.error('Не удалось экспортировать отчёт:', error)
    return Response.json(
      { error: 'Не удалось экспортировать отчёт.' },
      { status: 503 },
    )
  }
}
