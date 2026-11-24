import { cache } from 'react'
import { VACANCIES_CONFIG } from '@/shared/configs/vacancies.config'
import type {
  CatalogResponse,
  CatalogStatus,
  Snapshot,
  VacancyResponse,
} from '@/shared/types/analysis.type'
import { getDemoSnapshot } from '@/services/storage/demoSnapshot'
import { readSnapshot } from '@/services/storage/snapshotStore'
import type { CatalogQuery } from './catalogQuery'

export async function getCatalogSnapshot(): Promise<{
  snapshot: Snapshot | null
  status: CatalogStatus
}> {
  const database = process.env.DATABASE_URL
  const demo =
    process.env.CATALOG_DEMO === '1' ||
    (!database && process.env.NODE_ENV === 'development')
  const { snapshot, failedAt } = demo
    ? { snapshot: getDemoSnapshot(), failedAt: null }
    : database
      ? await readSnapshot()
      : { snapshot: null, failedAt: null }

  return {
    snapshot,
    status: {
      mode: demo ? 'demo' : database ? 'live' : 'unconfigured',
      updatedAt: snapshot?.generatedAt ?? null,
      failedAt,
    },
  }
}

const normalizeSearch = (text: string) =>
  text.toLocaleLowerCase('ru').replaceAll('ё', 'е')

export async function readCatalog(
  query: CatalogQuery,
): Promise<CatalogResponse> {
  const { snapshot, status } = await getCatalogSnapshot()
  const words = normalizeSearch(query.q).split(/\s+/).filter(Boolean)
  const matches = (snapshot?.entries ?? []).filter(({ vacancy, issues }) => {
    if (
      query.minSalary &&
      (vacancy.salaryMax ?? vacancy.salaryMin ?? 0) < query.minSalary
    )
      return false
    if (query.issues === 'clean' && issues.length) return false
    if (query.issues === 'flagged' && !issues.length) return false
    if (
      query.issues === 'many' &&
      issues.length < VACANCIES_CONFIG.HIGH_ISSUE_COUNT
    )
      return false

    const text = normalizeSearch(
      [
        vacancy.title,
        vacancy.company,
        vacancy.category,
        vacancy.duty,
        vacancy.requirements,
        vacancy.skills,
        vacancy.description,
        ...vacancy.addresses,
      ].join(' '),
    )
    return words.every((word) => text.includes(word))
  })

  const { PAGE_SIZE } = VACANCIES_CONFIG
  const pageCount = Math.ceil(matches.length / PAGE_SIZE)
  const page = Math.min(query.page, pageCount || 1)
  const vacancies = matches
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map(({ vacancy, issues }) => {
      const { id, title, company, salaryMin, salaryMax, salaryText, currency } =
        vacancy
      return {
        id,
        title,
        company,
        salaryMin,
        salaryMax,
        salaryText,
        currency,
        experience: vacancy.experience ?? null,
        issueCount: issues.length,
      }
    })
  return { vacancies, page, total: matches.length, pageCount, status }
}

export async function readVacancy(id: string): Promise<VacancyResponse | null> {
  const { snapshot, status } = await getCatalogSnapshot()
  const entry = snapshot?.entries.find(({ vacancy }) => vacancy.id === id)
  if (!snapshot || !entry) return null
  return {
    vacancy: entry.vacancy,
    issues: entry.issues,
    analyzedAt: snapshot.generatedAt,
    mode: status.mode,
  }
}

export const getVacancy = cache(readVacancy)
