import { connection, type NextRequest } from 'next/server'
import { readCatalogQuery } from '@/services/vacancies/catalogQuery'
import { readCatalog } from '@/services/vacancies/readCatalog'

export async function GET(request: NextRequest) {
  await connection()
  try {
    return Response.json(
      await readCatalog(readCatalogQuery(request.nextUrl.searchParams)),
      {
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  } catch (error) {
    console.error('Не удалось прочитать каталог:', error)
    return Response.json(
      { error: 'Не удалось прочитать каталог.' },
      { status: 503 },
    )
  }
}
