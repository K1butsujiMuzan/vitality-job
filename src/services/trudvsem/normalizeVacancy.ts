import type { Vacancy } from '@/shared/types/vacancy.type'
import type { SourceVacancy } from './trudvsem.schema'
import {
  getSourceAddresses,
  getSourceList,
  numberValue,
  objectValue,
  safeUrl,
  textValue,
  valueList,
} from './sourceFields'

export function normalizeVacancy(raw: SourceVacancy): Vacancy {
  const company = objectValue(raw.company)
  const requirement = objectValue(raw.requirement)

  const contacts = valueList(raw.contact_list).flatMap((item) => {
    const contact = objectValue(item)
    const label = textValue(contact.contact_type)
    const value = textValue(contact.contact_value)
    return label && value ? [{ label, value }] : []
  })
  if (!contacts.some(({ label }) => /почта|e-?mail/i.test(label))) {
    const email = textValue(company.email)
    if (email) contacts.push({ label: 'Эл. почта', value: email })
  }

  const term = textValue(objectValue(raw.term).text)
  const bonus =
    term
      ?.replace(/^QUARTERLY\b\s*/i, 'Квартальная премия: ')
      .replace(/^MONTHLY\b\s*/i, 'Ежемесячная премия: ')
      .replace(/^(?:ANNUAL|YEARLY)\b\s*/i, 'Годовая премия: ') ?? null
  const updatedAt = textValue(raw.date_modify ?? raw['creation-date'])

  return {
    id: raw.id,
    title: textValue(raw['job-name'] ?? raw.title) ?? 'Должность не указана',
    company: textValue(company.name ?? raw.employer),
    source: textValue(raw.source),
    url: safeUrl(raw.vac_url ?? raw.url),
    region: textValue(objectValue(raw.region).name ?? raw.region),
    salaryMin: numberValue(raw.salary_min) || null,
    salaryMax: numberValue(raw.salary_max) || null,
    salaryText: textValue(raw.salary),
    currency: textValue(raw.currency),
    employment: textValue(raw.employment),
    schedule: textValue(raw.schedule),
    category: textValue(objectValue(raw.category).specialisation),
    education: textValue(requirement.education),
    experience: numberValue(requirement.experience),
    workPlaces: numberValue(raw.work_places),
    conditions: textValue(raw.conditions),
    bonus,
    updatedAt:
      updatedAt && Number.isFinite(Date.parse(updatedAt)) ? updatedAt : null,
    skills: getSourceList(raw.skills) ?? textValue(requirement.qualification),
    duty: textValue(raw.duty ?? raw.responsibilities),
    requirements: textValue(raw.requirements) ?? textValue(raw.qualification),
    description: textValue(raw.description),
    addresses: [...new Set(getSourceAddresses(raw).map(([, value]) => value))],
    contactPerson: textValue(raw.contact_person),
    contacts,
  }
}
