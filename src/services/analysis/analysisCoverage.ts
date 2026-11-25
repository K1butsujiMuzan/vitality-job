import type { IssueTopic } from '@/shared/types/analysis.type'
import { TOPIC_FIELDS } from './analysisFields'

const MISSING_VALUES = /^(?:[-–—]+|не указано?|нет данных|n\/a)$/i
const NARRATIVE_FIELDS = [
  'description',
  'duty',
  'responsibilities',
  'requirements',
  'qualification',
  'requirement.qualification',
  'conditions',
  'benefitDetails',
]
const PAY_AMOUNT =
  /\d[\d\s]*(?:₽|руб(?![а-яё])|рубл[еяй]|тыс\.)|(?:оклад|зарплата|заработная плата)\s*[:–—-]?\s*(?:от\s+)?\d{2,}/i
const VAGUE_PAY = /по договор[её]нности|договорная|по итогам собеседования/i
const WORK_DAYS =
  /\b\d{1,2}\s*\/\s*\d{1,2}\b|пн\s*[–—-]\s*пт|понедельника по пятницу|пятиднев|шестиднев/i
const WORK_HOURS = /\b\d{1,2}[:.]\d{2}\s*(?:[–—-]|до)\s*\d{1,2}[:.]\d{2}\b/i
const REMOTE = /удал[её]н|дистанцион/i
const WORK_ADDRESS =
  /(?:^|[\s,])(?:улица|ул\.|проспект|переулок|пер\.|шоссе)\s|адрес\s*(?:работы|рабочего места)\s*:/i
const EMPLOYMENT =
  /(?:полн\S*|частичн\S*|неполн\S*|временн\S*)\s+занятост|совместительств|\d[\d,.]*\s+ставк|трудов\S*\s+договор|договор\s+гпх/i

export const VAGUE_SCHEDULE =
  /^(?:полный рабочий день|сменн(?:ый график|ая работа)|гибкий график|по графику сменности)$/i

export function isFilled(field: string, value: string | undefined) {
  return Boolean(
    value &&
    !MISSING_VALUES.test(value) &&
    !(field.startsWith('salary') && /^0(?:[.,]0+)?$/.test(value)),
  )
}

export function getCoverage(fields: Record<string, string>) {
  const filled = Object.entries(fields).filter(([field, value]) =>
    isFilled(field, value),
  )
  const values = (paths: readonly string[]) =>
    filled.filter(([field]) =>
      paths.some(
        (path) =>
          field === path ||
          field.startsWith(path + '[') ||
          field.startsWith(path + '.'),
      ),
    )
  const narrative = values(NARRATIVE_FIELDS)
    .map(([, value]) => value)
    .join('\n')
  const description = fields.description ?? ''
  const schedules = values(TOPIC_FIELDS.schedule)
  const timetable = [narrative, ...schedules.map(([, value]) => value)].join(
    '\n',
  )
  const concreteSchedule =
    WORK_DAYS.test(timetable) || WORK_HOURS.test(timetable)
  const hasAmount =
    values(['salary_min', 'salary_max']).some(
      ([, value]) => Number(value) > 0,
    ) ||
    (/\d/.test(fields.salary ?? '') && isFilled('salary', fields.salary)) ||
    PAY_AMOUNT.test(narrative)
  const vaguePay = !hasAmount && VAGUE_PAY.test(fields.salary ?? '')
  const vagueSchedule = concreteSchedule
    ? undefined
    : schedules.find(([, value]) => VAGUE_SCHEDULE.test(value))

  const covered: Record<IssueTopic, boolean> = {
    title: values(TOPIC_FIELDS.title).length > 0,
    duties: values(['duty', 'responsibilities']).length > 0,
    requirements:
      values(TOPIC_FIELDS.requirements).length > 0 ||
      /опыт\s+работы|образовани|профильн\S*\s+навык/i.test(description),
    pay: hasAmount || vaguePay || isFilled('salary', fields.salary),
    schedule:
      schedules.length > 0 ||
      concreteSchedule ||
      /график|сменн/i.test(narrative),
    location:
      values(TOPIC_FIELDS.location.slice(2)).length > 0 ||
      REMOTE.test(timetable) ||
      WORK_ADDRESS.test(narrative),
    employment:
      values(TOPIC_FIELDS.employment).length > 0 || EMPLOYMENT.test(narrative),
  }

  return {
    covered,
    hasDescription: isFilled('description', description),
    concreteSchedule,
    vaguePay,
    vagueSchedule,
  }
}
