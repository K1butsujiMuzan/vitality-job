import { SourcePageSchema, type SourceVacancy } from './trudvsem.schema'

const SOURCE_PAGE_SIZE = 20
const SOURCE_TIMEOUT_MS = 25_000

export async function fetchVacancies(
  source: string,
  limit: number,
  signal?: AbortSignal,
) {
  const vacancies = new Map<string, SourceVacancy>()
  const pageSize = Math.min(limit, SOURCE_PAGE_SIZE)
  let pages = 0
  let received = 0

  while (received < limit) {
    const url = new URL(source)
    url.searchParams.set('limit', String(pageSize))
    url.searchParams.set('offset', String(pages))
    const timeout = AbortSignal.timeout(SOURCE_TIMEOUT_MS)
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    })
    if (!response.ok) {
      throw new Error(`API «Работа в России»: HTTP ${response.status}`)
    }

    const page = SourcePageSchema.parse(await response.json())
    const items = page.results.vacancies
    const previousSize = vacancies.size
    for (const { vacancy } of items.slice(0, limit - received)) {
      if (!vacancies.has(vacancy.id)) vacancies.set(vacancy.id, vacancy)
    }
    if (items.length && vacancies.size === previousSize) {
      throw new Error('API «Работа в России» повторил предыдущую страницу.')
    }

    received += items.length
    pages++
    if (received >= (page.meta?.total ?? Infinity) || items.length < pageSize)
      break
  }

  return { vacancies: [...vacancies.values()], pages }
}
