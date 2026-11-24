import type { IssueTopic } from '@/shared/types/analysis.type'
import type { SourceVacancy } from '@/services/trudvsem/trudvsem.schema'
import {
  getSourceAddresses,
  objectValue,
  textValue,
} from '@/services/trudvsem/sourceFields'

export const TOPIC_FIELDS: Record<IssueTopic, readonly string[]> = {
  title: ['job-name', 'title'],
  duties: ['duty', 'responsibilities'],
  requirements: [
    'requirements',
    'qualification',
    'requirement.education',
    'requirement.qualification',
    'requirement.experience',
    'medicalDocuments',
    'skills',
  ],
  pay: ['salary', 'salary_min', 'salary_max', 'currency', 'term.text'],
  schedule: ['schedule', 'shift'],
  location: [
    'region.name',
    'region',
    'addresses.address',
    'address',
    'workplace',
  ],
  employment: ['employment', 'employment_type', 'contract_type'],
}

function appendField(
  fields: Record<string, string>,
  path: string,
  value: unknown,
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      appendField(fields, `${path}[${index}]`, item),
    )
    return
  }

  if (value && typeof value === 'object') {
    Object.entries(objectValue(value)).forEach(([key, item]) =>
      appendField(fields, `${path}.${key}`, item),
    )
    return
  }

  const text = textValue(value)
  if (text) fields[path] = text
}

export function getAnalysisFields(raw: SourceVacancy) {
  const fields: Record<string, string> = {}

  for (const path of [
    ...new Set(Object.values(TOPIC_FIELDS).flat()),
    'description',
    'conditions',
    'benefitDetails',
  ]) {
    if (
      path === 'addresses.address' ||
      (path === 'region' && typeof raw.region === 'object')
    )
      continue
    const value = path
      .split('.')
      .reduce<unknown>((record, key) => objectValue(record)[key], raw)
    appendField(fields, path, value)
  }

  return { ...fields, ...Object.fromEntries(getSourceAddresses(raw)) }
}
