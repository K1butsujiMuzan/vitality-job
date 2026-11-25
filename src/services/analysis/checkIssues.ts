import type { Issue, IssueTopic } from '@/shared/types/analysis.type'
import { getCoverage, VAGUE_SCHEDULE } from './analysisCoverage'
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

const SALARY_BOUNDS = ['salary_min', 'salary_max']
const SALARY_CONTRADICTION_FIELDS = [...SALARY_BOUNDS, 'salary', 'description']
const EXPERIENCE_REQUIREMENT =
  /(?:\d[\d,.]*(?:[-‑][а-яё]{1,3})?|одного|двух|тр[её]х)\s*(?:год|лет|месяц)|полугода|без опыта|опыт\s+(?:не\s+требу|обязател|желател)|будет преимуществ/i

export function checkIssues(fields: Record<string, string>) {
  const issues: Issue[] = []
  const { covered, hasDescription, vaguePay, vagueSchedule } =
    getCoverage(fields)
  for (const topic of Object.keys(covered) as IssueTopic[]) {
    if (
      covered[topic] ||
      (hasDescription && (topic === 'duties' || topic === 'requirements'))
    )
      continue
    const [problem, recommendation] = MISSING_DETAILS[topic]
    issues.push({
      topic,
      kind: 'missing',
      evidence: [
        {
          field: topic === 'location' ? 'address' : TOPIC_FIELDS[topic][0],
          quote: '',
        },
      ],
      problem,
      recommendation,
    })
  }

  if (vagueSchedule) {
    const [field, quote] = vagueSchedule
    issues.push({
      topic: 'schedule',
      kind: 'ambiguous',
      evidence: [{ field, quote }],
      problem:
        'Общий формат графика указан, но в вакансии нет рабочих дней, часов или порядка смен.',
      recommendation:
        'Укажите рабочие дни и часы или объясните, как составляется график смен.',
    })
  }

  if (vaguePay) {
    issues.push({
      topic: 'pay',
      kind: 'ambiguous',
      evidence: [{ field: 'salary', quote: fields.salary }],
      problem:
        'По формулировке нельзя понять порядок оплаты и ожидаемую сумму.',
      recommendation:
        'Укажите оклад или диапазон и поясните, от чего зависит итоговая сумма.',
    })
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
  const { covered, concreteSchedule } = getCoverage(fields)

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
        concreteSchedule &&
        kind === 'ambiguous' &&
        evidence.every(({ quote }) => VAGUE_SCHEDULE.test(quote))
      )
        return false

      if (kind === 'missing') {
        return (
          !covered[topic] &&
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
        topic === 'requirements' &&
        kind === 'contradiction' &&
        evidence.some(({ field }) => field === 'requirement.experience') &&
        !evidence.some(
          ({ field, quote }) =>
            [
              'requirements',
              'qualification',
              'requirement.qualification',
              'description',
            ].includes(field) && EXPERIENCE_REQUIREMENT.test(quote),
        )
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

export function mergeAnalysisIssues(
  fields: Record<string, string>,
  proposed: Issue[],
  rules = checkIssues(fields),
) {
  const issues = [...rules]
  for (const issue of groundModelIssues(proposed, fields)) {
    const sameFinding = issues.some(
      (previous) =>
        previous.topic === issue.topic &&
        previous.kind === issue.kind &&
        (issue.kind === 'missing' ||
          (issue.kind === 'ambiguous'
            ? previous.evidence.some((a) =>
                issue.evidence.some((b) => a.field === b.field),
              )
            : previous.evidence.length === issue.evidence.length &&
              previous.evidence.every((a) =>
                issue.evidence.some(
                  (b) => a.field === b.field && a.quote === b.quote,
                ),
              ))),
    )
    if (!sameFinding) issues.push(issue)
  }
  return issues
}
