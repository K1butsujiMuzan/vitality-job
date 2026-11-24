import { randomUUID } from 'node:crypto'
import { PROCESSING_CONFIG } from '@/shared/configs/processing.config'
import type { Snapshot } from '@/shared/types/analysis.type'
import { getDatabase } from './database'

export async function readSnapshot() {
  const sql = getDatabase()
  const [row] = await sql<
    { snapshot: Snapshot | null; failed_at: Date | null }[]
  >`
    SELECT snapshot, failed_at FROM vitality_job_catalog WHERE id = true
  `
  if (!row) throw new Error('Хранилище не инициализировано.')
  return {
    snapshot: row.snapshot,
    failedAt: row.failed_at?.toISOString() ?? null,
  }
}

export async function acquireLease() {
  const sql = getDatabase()
  const token = randomUUID()
  const [row] = await sql<{ lease_token: string }[]>`
    UPDATE vitality_job_catalog
    SET lease_token = ${token},
        lease_until = now() + make_interval(secs => ${PROCESSING_CONFIG.LEASE_SECONDS})
    WHERE id = true AND (lease_until IS NULL OR lease_until <= now())
    RETURNING lease_token
  `
  return row?.lease_token ?? null
}

export async function saveSnapshot(token: string, snapshot: Snapshot) {
  const sql = getDatabase()
  const [row] = await sql`
    UPDATE vitality_job_catalog
    SET snapshot = ${sql.json(snapshot)}, failed_at = NULL,
        lease_token = NULL, lease_until = NULL
    WHERE id = true AND lease_token = ${token} AND lease_until > now()
    RETURNING id
  `
  if (!row) throw new Error('Истёк срок блокировки обновления каталога.')
}

export async function recordFailure(token: string) {
  const sql = getDatabase()
  await sql`
    UPDATE vitality_job_catalog
    SET failed_at = now(), lease_token = NULL, lease_until = NULL
    WHERE id = true AND lease_token = ${token}
  `
}
