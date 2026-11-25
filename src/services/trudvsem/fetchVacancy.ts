import { PROCESSING_CONFIG } from '@/shared/configs/processing.config'
import { safeUrl } from './sourceFields'
import { SourcePageSchema } from './trudvsem.schema'

export function getVacancyReference(value: unknown) {
  const url = safeUrl(value)
  if (!url) return null
  const { hostname, pathname } = new URL(url)
  if (hostname !== 'trudvsem.ru' && hostname !== 'www.trudvsem.ru') return null
  const match =
    /^\/vacancy\/card\/(\d{10,15})\/([a-zA-Z0-9_-]{1,128})\/?$/.exec(pathname)
  return match ? { companyId: match[1], id: match[2] } : null
}

export async function fetchVacancy(
  reference: NonNullable<ReturnType<typeof getVacancyReference>>,
  signal: AbortSignal,
) {
  const url = new URL(
    `/api/v1/vacancies/vacancy/${reference.companyId}/${reference.id}`,
    PROCESSING_CONFIG.SOURCE_URL,
  )
  const response = await fetch(url, {
    cache: 'no-store',
    redirect: 'error',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.any([signal, AbortSignal.timeout(20_000)]),
  })
  if (response.status === 404) return null
  if (!response.ok)
    throw new Error(`API «Работа в России»: HTTP ${response.status}`)
  return (
    SourcePageSchema.parse(await response.json()).results.vacancies.find(
      ({ vacancy }) => vacancy.id === reference.id,
    )?.vacancy ?? null
  )
}
