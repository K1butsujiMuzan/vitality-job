import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { formatEvidence } from './formatEvidence'

test('requirement excerpts keep their original wording under a readable label', () => {
  const quote = 'опыт управление проектами в сфере цифровой трансформации и ИТ'
  assert.deepEqual(formatEvidence({ field: 'requirements', quote }), {
    label: 'Требования к кандидату',
    value: quote,
    quoted: true,
  })
})

test('numeric experience uses Russian year forms', () => {
  assert.deepEqual(
    formatEvidence({ field: 'requirement.experience', quote: '3' }),
    { label: 'Опыт работы', value: '3 года', quoted: false },
  )
  assert.equal(
    formatEvidence({ field: 'requirement.experience', quote: '0' }).value,
    'Без опыта',
  )
})

test('indexed source fields resolve to the label of their collection', () => {
  assert.equal(
    formatEvidence({
      field: 'addresses.address[0].location',
      quote: 'Калининград',
    }).label,
    'Адрес работы',
  )
})
