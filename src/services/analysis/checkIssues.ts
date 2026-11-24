import type { Issue, IssueTopic } from '@/shared/types/analysis.type'
import { TOPIC_FIELDS } from './analysisFields'

const MISSING_DETAILS: Record<IssueTopic, [string, string]> = {
  title: [
    'Название должности не указано.',
    'Уточните точное название должности.',
  ],
  duties: [
    'Основные задачи не описаны.',
    'Перечислите ежедневные задачи и зону ответственности сотрудника.',
  ],
  requirements: [
    'Требования к соискателю не указаны.',
    'Уточните минимальный опыт, образование и навыки. Если ограничений нет, укажите это явно.',
  ],
  pay: [
    'Размер оплаты не указан.',
    'Укажите оклад или диапазон, период оплаты и входит ли в сумму премия.',
  ],
  schedule: [
    'График работы не указан.',
    'Укажите рабочие дни, часы или порядок чередования смен.',
  ],
  location: [
    'Место или формат работы не указаны.',
    'Укажите адрес рабочего места или подтвердите дистанционный формат.',
  ],
  employment: [
    'Тип занятости не указан.',
    'Уточните, полная, частичная или временная это занятость.',
  ],
}

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
const SCHEDULE_LABEL =
  /^(?:полный рабочий день|сменный график|гибкий график|удал[её]нная работа|удал[её]нно)$/i
const WORK_DAYS =
  /\b\d{1,2}\s*\/\s*\d{1,2}\b|пн\s*[–—-]\s*пт|понедельника по пятницу/i
const WORK_HOURS = /\b\d{1,2}[:.]\d{2}\s*(?:[–—-]|до)\s*\d{1,2}[:.]\d{2}\b/i
const SALARY_BOUNDS = ['salary_min', 'salary_max']
const SALARY_CONTRADICTION_FIELDS = [...SALARY_BOUNDS, 'salary', 'description']

const hasTimetable = (text: string) =>
  WORK_DAYS.test(text) && WORK_HOURS.test(text)

export function checkIssues(fields: Record<string, string>) {
  const issues: Issue[] = []
  const hasNarrative = NARRATIVE_FIELDS.some((key) => {
    const value = fields[key]
    return value && !MISSING_VALUES.test(value)
  })
  if (!hasNarrative) {
    for (const [topic, paths] of Object.entries(TOPIC_FIELDS) as [
      IssueTopic,
      readonly string[],
    ][]) {
      const relevantPaths = topic === 'pay' ? paths.slice(0, 3) : paths
      const hasValue = Object.entries(fields).some(
        ([field, value]) =>
          !MISSING_VALUES.test(value) &&
          !(topic === 'pay' && /^0(?:[.,]0+)?$/.test(value)) &&
          relevantPaths.some(
            (path) => field === path || field.startsWith(path + '['),
          ),
      )
      if (
        hasValue ||
        (topic === 'location' &&
          /удал[её]н|дистанцион/i.test(fields.schedule ?? ''))
      )
        continue
      const [problem, recommendation] = MISSING_DETAILS[topic]
      issues.push({
        topic,
        kind: 'missing',
        evidence: [{ field: paths[0], quote: '' }],
        problem,
        recommendation,
      })
    }
  }

  if (
    Number(fields.salary_min) > Number(fields.salary_max) &&
    Number(fields.salary_max) > 0
  ) {
    issues.push({
      topic: 'pay',
      kind: 'contradiction',
      evidence: [
        { field: 'salary_min', quote: fields.salary_min },
        { field: 'salary_max', quote: fields.salary_max },
      ],
      problem: 'Нижняя граница зарплаты больше верхней.',
      recommendation:
        'Сверьте обе суммы и укажите корректные границы зарплаты.',
    })
  }

  return issues
}

export function groundModelIssues(
  issues: Issue[],
  fields: Record<string, string>,
) {
  const knownFields = new Set(Object.values(TOPIC_FIELDS).flat())
  const scheduleText = Object.entries(fields)
    .filter(
      ([field]) =>
        [
          'schedule',
          'description',
          'conditions',
          'duty',
          'responsibilities',
        ].includes(field) || field.startsWith('shift['),
    )
    .map(([, value]) => value)
    .join('\n')

  return issues
    .map((issue): Issue => {
      const evidenceFields = issue.evidence.map(({ field }) => field)
      if (
        issue.kind === 'contradiction' &&
        evidenceFields.some((field) => SALARY_BOUNDS.includes(field)) &&
        evidenceFields.every((field) =>
          SALARY_CONTRADICTION_FIELDS.includes(field),
        )
      ) {
        return { ...issue, topic: 'pay' }
      }
      return issue
    })
    .filter(({ topic, kind, evidence }) => {
      if (
        topic === 'schedule' &&
        hasTimetable(scheduleText) &&
        (kind === 'missing' ||
          (kind === 'ambiguous' &&
            evidence.every(
              ({ quote }) => SCHEDULE_LABEL.test(quote) || hasTimetable(quote),
            )))
      )
        return false

      if (kind === 'missing') {
        return (
          evidence.length === 1 &&
          evidence[0].quote === '' &&
          (knownFields.has(evidence[0].field) ||
            Object.hasOwn(fields, evidence[0].field))
        )
      }
      if (
        kind === 'contradiction' &&
        (evidence.length !== 2 || evidence[0].quote === evidence[1].quote)
      )
        return false
      if (
        topic === 'pay' &&
        kind === 'contradiction' &&
        evidence.some(({ field }) => field === 'salary_min') &&
        evidence.some(({ field }) => field === 'salary_max') &&
        Number(fields.salary_min) <= Number(fields.salary_max)
      )
        return false
      return evidence.every(
        ({ field, quote }) =>
          quote &&
          Object.hasOwn(fields, field) &&
          fields[field].includes(quote),
      )
    })
}
