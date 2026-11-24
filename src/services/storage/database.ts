import postgres from 'postgres'

let sql: ReturnType<typeof postgres> | undefined

export function getDatabase() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('Задайте DATABASE_URL для хранения отчётов.')

  sql ??= postgres(url, {
    max: 2,
    prepare: false,
    connect_timeout: 5,
    idle_timeout: 20,
  })
  return sql
}
