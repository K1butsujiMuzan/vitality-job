import { readFile } from 'node:fs/promises'
import { getDatabase } from '@/services/storage/database'

const sql = getDatabase()
try {
  const schema = await readFile(
    new URL('../src/services/storage/schema.sql', import.meta.url),
    'utf8',
  )
  await sql.unsafe(schema).simple()
  console.log('Хранилище VitalityJob готово.')
} finally {
  await sql.end()
}
