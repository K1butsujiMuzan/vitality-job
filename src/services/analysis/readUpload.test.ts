import assert from 'node:assert/strict'
import { test } from 'node:test'
import { UPLOAD_CONFIG } from '@/shared/configs/upload.config'
import { readUpload, readUploadedVacancy } from './readUpload'

const vacancy = {
  id: 'test-01',
  'job-name': 'Пекарь',
  schedule: 'Сменный график',
}

test('accepts a vacancy object, its wrapper and an original API response', () => {
  assert.equal(
    readUploadedVacancy({ title: 'Пекарь' }).vacancy.id,
    'uploaded-vacancy',
  )
  assert.deepEqual(readUploadedVacancy({ vacancy }).vacancy, vacancy)
  assert.deepEqual(
    readUploadedVacancy({ results: { vacancies: [{ vacancy }] } }).vacancy,
    vacancy,
  )
})

test('recognizes a previous report as a reference and keeps its original ID', () => {
  const data = {
    id: 'test-01',
    url: 'https://trudvsem.ru/vacancy/card/1023902274406/test-01',
    issues: [],
  }
  const upload = readUploadedVacancy({ vacancies: [data] })
  assert.equal(upload.hasSourceFields, false)
  assert.deepEqual(upload.reference, {
    id: 'test-01',
    companyId: '1023902274406',
  })
  assert.throws(() => readUploadedVacancy({ ...data, id: 'different' }), {
    message: 'ID вакансии в JSON и в ссылке различаются.',
  })
  const external = readUploadedVacancy({
    ...data,
    url: 'https://other.test/vacancy/card/1023902274406/test-01',
  })
  assert.equal(external.reference, null)
})

test('accepts normalized and nested vacancy JSON', () => {
  const { vacancy, hasSourceFields } = readUploadedVacancy({
    data: {
      vacancy: {
        vacancyId: 'other-01',
        vacancyName: 'Водитель',
        salaryMin: 50000,
        experience: 0,
        addresses: ['Калининград, улица Ленина, 1'],
      },
    },
  })
  assert.equal(hasSourceFields, true)
  assert.equal(vacancy.id, 'other-01')
  assert.equal(vacancy['job-name'], 'Водитель')
  assert.equal(vacancy.salary_min, 50000)
  assert.deepEqual(vacancy.addresses, {
    address: ['Калининград, улица Ленина, 1'],
  })
  assert.equal((vacancy.requirement as { experience: number }).experience, 0)
})

test('rejects files with multiple vacancies', () => {
  assert.throws(
    () =>
      readUploadedVacancy({
        results: { vacancies: [{ vacancy }, { vacancy }] },
      }),
    { message: 'В файле должна быть одна вакансия.' },
  )
})

test('enforces the upload size limit before parsing JSON', async () => {
  const request = new Request('http://localhost/api/analyze', {
    method: 'POST',
    body: ' '.repeat(UPLOAD_CONFIG.MAX_FILE_BYTES + 1),
  })

  await assert.rejects(readUpload(request), { status: 413 })
})
