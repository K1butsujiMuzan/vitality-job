import { VACANCIES_CONFIG } from '@/shared/configs/vacancies.config'

export const ISSUE_FILTERS = {
  all: 'Все вакансии',
  clean: 'Без замечаний',
  flagged: 'С замечаниями',
  many: `${VACANCIES_CONFIG.HIGH_ISSUE_COUNT} замечаний и больше`,
} as const

export type CatalogQuery = {
  q: string
  page: number
  minSalary: number | null
  issues: keyof typeof ISSUE_FILTERS
}

export function readCatalogQuery(params: URLSearchParams): CatalogQuery {
  const page = Number(params.get('page'))
  const minSalary = Number(params.get('minSalary'))
  const issues = params.get('issues') ?? 'all'

  return {
    q: (params.get('q') ?? '').trim().slice(0, VACANCIES_CONFIG.QUERY_LENGTH),
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    minSalary:
      Number.isSafeInteger(minSalary) &&
      minSalary > 0 &&
      minSalary <= VACANCIES_CONFIG.MIN_SALARY_LIMIT
        ? minSalary
        : null,
    issues: Object.hasOwn(ISSUE_FILTERS, issues)
      ? (issues as CatalogQuery['issues'])
      : 'all',
  }
}

export function getCatalogUrl(path: string, query: CatalogQuery) {
  const params = new URLSearchParams()
  if (query.q) params.set('q', query.q)
  if (query.page > 1) params.set('page', String(query.page))
  if (query.minSalary) params.set('minSalary', String(query.minSalary))
  if (query.issues !== 'all') params.set('issues', query.issues)
  return params.size ? `${path}?${params}` : path
}
