import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { analyzeVacancies } from '@/services/analysis/analyzeVacancies'
import { getModelConfig } from '@/services/analysis/modelClient'
import { buildReport } from '@/services/reports/buildReport'
import { readSourcePages } from '@/services/trudvsem/trudvsem.schema'

async function main() {
  const [input, output = 'reports/local.json', ...rest] = process.argv.slice(2)
  if (!input || rest.length)
    throw new Error(
      'Использование: bun run analyze:json <вход.json> [отчёт.json]',
    )
  if (resolve(input) === resolve(output))
    throw new Error('Укажите отдельный путь для отчёта.')

  const pages = readSourcePages(JSON.parse(await readFile(input, 'utf8')))
  const model = getModelConfig(true)
  const entries = await analyzeVacancies(
    pages.flatMap((page) =>
      page.results.vacancies.map(({ vacancy }) => vacancy),
    ),
    model,
    [],
    1,
  )
  const report = buildReport({
    generatedAt: new Date().toISOString(),
    source: 'local-json',
    model: model.model,
    pages: pages.length,
    entries,
  })

  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, JSON.stringify(report, null, 2) + '\n', 'utf8')
  console.log(
    `Вакансий: ${entries.length}. Модель: ${model.model}. Отчёт: ${output}.`,
  )
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
