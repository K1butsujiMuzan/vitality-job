import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import type { Issue } from '@/shared/types/analysis.type'
import { checkIssues, groundModelIssues } from './checkIssues'

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
