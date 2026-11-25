import type {
  ANALYSIS_TOPICS,
  ISSUE_KINDS,
} from '@/shared/constants/analysis.constant'
import type { Vacancy, VacancySummary } from './vacancy.type'

export type IssueTopic = keyof typeof ANALYSIS_TOPICS
export type IssueKind = keyof typeof ISSUE_KINDS
export type Evidence = { field: string; quote: string }
export type Issue = {
  topic: IssueTopic
  kind: IssueKind
  evidence: Evidence[]
  problem: string
  recommendation: string
}

export type AnalyzedVacancy = {
  vacancy: Vacancy
  issues: Issue[]
  fingerprint: string
}

export type Snapshot = {
  generatedAt: string
  source: string
  model: string
  pages: number
  entries: AnalyzedVacancy[]
}

export type CatalogStatus = {
  mode: 'live' | 'demo' | 'unconfigured'
  updatedAt: string | null
  failedAt: string | null
}

export type CatalogResponse = {
  vacancies: VacancySummary[]
  page: number
  total: number
  pageCount: number
  status: CatalogStatus
}

export type VacancyResponse = Pick<AnalyzedVacancy, 'vacancy' | 'issues'> & {
  analyzedAt: string
  mode: CatalogStatus['mode']
}

export type AnalysisReport = {
  version: number
  generatedAt: string
  source: string
  model: string
  pages: number
  vacancies: { id: string; url: string | null; issues: Issue[] }[]
}

export type UploadAnalysisResponse = {
  title: string
  company: string | null
  report: AnalysisReport
}
