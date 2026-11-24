import type { CatalogResponse } from '@/shared/types/analysis.type'
import { getCatalogUrl, type CatalogQuery } from './catalogQuery'

export async function fetchCatalog(
  query: CatalogQuery,
  signal: AbortSignal,
): Promise<CatalogResponse> {
  const response = await fetch(getCatalogUrl('/api/vacancies', query), {
    signal,
  })
  if (!response.ok) throw new Error('Не удалось загрузить каталог.')
  return response.json()
}
