import { connection } from 'next/server'
import { readVacancy } from '@/services/vacancies/readCatalog'

export async function GET(
  _: Request,
  { params }: RouteContext<'/api/vacancies/[id]'>,
) {
  await connection()
  const { id } = await params
  try {
    const vacancy = await readVacancy(id)
    return vacancy
      ? Response.json(vacancy, { headers: { 'Cache-Control': 'no-store' } })
      : Response.json({ error: 'Вакансия не найдена.' }, { status: 404 })
  } catch (error) {
    console.error('Не удалось прочитать вакансию:', error)
    return Response.json(
      { error: 'Не удалось прочитать вакансию.' },
      { status: 503 },
    )
  }
}
