import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import type { Issue } from '@/shared/types/analysis.type'
import {
  checkIssues,
  groundModelIssues,
  mergeAnalysisIssues,
} from './checkIssues'

test('schedule details in the description resolve a broad structured label', () => {
  const issue: Issue = {
    topic: 'schedule',
    kind: 'ambiguous',
    evidence: [{ field: 'schedule', quote: 'Гибкий график' }],
    problem: 'График не раскрыт.',
    recommendation: 'Укажите рабочие дни и часы.',
  }

  assert.deepEqual(groundModelIssues([issue], { schedule: 'Гибкий график' }), [
    issue,
  ])
  assert.deepEqual(
    groundModelIssues([issue], {
      schedule: 'Гибкий график',
      description: 'График 2/2 с 10:00 до 22:00.',
    }),
    [],
  )
})

test('an ordered salary range cannot be the only evidence of a contradiction', () => {
  const issue: Issue = {
    topic: 'pay',
    kind: 'contradiction',
    evidence: [
      { field: 'salary_min', quote: '72000' },
      { field: 'salary_max', quote: '95000' },
    ],
    problem: 'Суммы различаются.',
    recommendation: 'Сверьте суммы.',
  }
  const fields = {
    salary_min: '72000',
    salary_max: '95000',
    description: 'Оклад 60 000 ₽.',
  }

  assert.deepEqual(groundModelIssues([issue], fields), [])
  const second = {
    ...issue,
    evidence: [issue.evidence[0], { field: 'description', quote: '60 000 ₽' }],
  }
  assert.deepEqual(groundModelIssues([second], fields), [second])
  assert.deepEqual(
    groundModelIssues([{ ...second, topic: 'schedule' }], fields),
    [second],
  )
})

test('rules do not flag missing pay if another text field can supply it', () => {
  const issues = checkIssues({
    'job-name': 'Техник',
    duty: 'Проверять оборудование. Оклад 60 000 ₽.',
  })
  assert.ok(
    !issues.some(({ topic, kind }) => topic === 'pay' && kind === 'missing'),
  )
})

test('checks independent gaps even when duties are present', () => {
  const issues = checkIssues({
    title: 'Техник',
    duty: 'Проверять оборудование.',
    'requirement.experience': '0',
    employment: 'Полная занятость',
    'region.name': 'Калининградская область',
    schedule: 'Сменная работа',
  })
  assert.deepEqual(
    issues.map(({ topic, kind }) => [topic, kind]),
    [
      ['pay', 'missing'],
      ['location', 'missing'],
      ['schedule', 'ambiguous'],
    ],
  )
})

test('uses concrete employment, workplace and schedule details from the description', () => {
  assert.deepEqual(
    checkIssues({
      title: 'Техник',
      duty: 'Проверять оборудование.',
      'requirement.experience': '0',
      schedule: 'Сменная работа',
      description:
        'Полная занятость. Оклад 60 000 руб. Калининград, улица Ленина, 1. График 2/2 с 10:00 до 22:00.',
    }),
    [],
  )
})

test('discards a claim of missing experience when the source specifies it', () => {
  const fabricatedMissing: Issue = {
    topic: 'requirements',
    kind: 'missing',
    evidence: [{ field: 'requirements', quote: '' }],
    problem: 'Опыт работы не указан.',
    recommendation: 'Уточните опыт работы.',
  }
  assert.deepEqual(
    groundModelIssues([fabricatedMissing], { 'requirement.experience': '1' }),
    [],
  )
})

test('keeps an explicit experience mismatch and ignores a mismatch with duties', () => {
  const issue: Issue = {
    topic: 'requirements',
    kind: 'contradiction',
    evidence: [
      { field: 'requirements', quote: 'опыт от 6-ти месяцев' },
      { field: 'requirement.experience', quote: '1' },
    ],
    problem: 'Указан разный стаж.',
    recommendation: 'Уточните единое требование к стажу.',
  }
  const fields = {
    requirements: issue.evidence[0].quote,
    'requirement.experience': '1',
    duty: 'Работа с тестом',
  }
  assert.deepEqual(groundModelIssues([issue], fields), [issue])
  assert.deepEqual(
    groundModelIssues(
      [
        {
          ...issue,
          evidence: [{ field: 'duty', quote: fields.duty }, issue.evidence[1]],
        },
      ],
      fields,
    ),
    [],
  )
})

test('keeps a schedule recommendation once even if the model words it differently', () => {
  const fields = { schedule: 'Полный рабочий день' }
  const duplicate: Issue = {
    topic: 'schedule',
    kind: 'ambiguous',
    evidence: [{ field: 'schedule', quote: fields.schedule }],
    problem: 'Нет времени начала рабочего дня.',
    recommendation: 'Укажите время начала рабочего дня.',
  }
  assert.equal(
    mergeAnalysisIssues(fields, [duplicate]).filter(
      (i) => i.topic === 'schedule',
    ).length,
    1,
  )
})
