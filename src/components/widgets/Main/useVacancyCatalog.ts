'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import {
  getCatalogUrl,
  readCatalogQuery,
  type CatalogQuery,
} from '@/services/vacancies/catalogQuery'
import { fetchCatalog } from '@/services/vacancies/vacanciesApi'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'

export function useVacancyCatalog() {
  const params = useSearchParams()
  const query = readCatalogQuery(new URLSearchParams(params.toString()))

  const result = useQuery({
    queryKey: ['vacancies', query],
    queryFn: ({ signal }) => fetchCatalog(query, signal),
  })

  function applyQuery(next: CatalogQuery) {
    const url = getCatalogUrl(PAGES_CONFIG.MAIN, next)
    if (url !== window.location.pathname + window.location.search) {
      window.history.pushState(null, '', url)
    }
  }

  return { query, ...result, applyQuery }
}
