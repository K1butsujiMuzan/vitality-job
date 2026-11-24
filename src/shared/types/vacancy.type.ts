export type Vacancy = {
  id: string
  title: string
  company: string | null
  source: string | null
  url: string | null
  region: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryText: string | null
  currency: string | null
  employment: string | null
  schedule: string | null
  category: string | null
  education: string | null
  experience: number | null
  workPlaces: number | null
  conditions: string | null
  bonus: string | null
  updatedAt: string | null
  skills: string | null
  duty: string | null
  requirements: string | null
  description: string | null
  addresses: string[]
  contactPerson: string | null
  contacts: { label: string; value: string }[]
}

export type VacancySummary = Pick<
  Vacancy,
  | 'id'
  | 'title'
  | 'company'
  | 'salaryMin'
  | 'salaryMax'
  | 'salaryText'
  | 'currency'
  | 'experience'
> & { issueCount: number }
