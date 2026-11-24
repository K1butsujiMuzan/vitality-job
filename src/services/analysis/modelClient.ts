import { setTimeout } from 'node:timers/promises'
import { PROCESSING_CONFIG } from '@/shared/configs/processing.config'
import type { Issue } from '@/shared/types/analysis.type'
import { ANALYSIS_PROMPT } from './analysisPrompt'
import {
  CompletionSchema,
  MODEL_RESPONSE_SCHEMA,
  ModelResultSchema,
} from './analysis.schema'

export function getModelConfig(local = false) {
  const override = process.env.AI_BASE_URL?.trim()
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  let baseUrl = override || PROCESSING_CONFIG.OLLAMA_URL
  if (!override && !local && accountId) {
    if (!/^[a-f0-9]{32}$/i.test(accountId)) {
      throw new Error('Проверьте CLOUDFLARE_ACCOUNT_ID.')
    }
    baseUrl = `${PROCESSING_CONFIG.CLOUDFLARE_API_URL}/${accountId}/ai/v1`
  }

  baseUrl = baseUrl.replace(/\/+$/, '')
  const hostname = new URL(baseUrl).hostname
  const groq = hostname === new URL(PROCESSING_CONFIG.GROQ_URL).hostname
  const cloudflare =
    hostname === new URL(PROCESSING_CONFIG.CLOUDFLARE_API_URL).hostname
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(hostname)
  const defaultModel = cloudflare
    ? PROCESSING_CONFIG.CLOUDFLARE_MODEL
    : groq
      ? PROCESSING_CONFIG.GROQ_MODEL
      : PROCESSING_CONFIG.OLLAMA_MODEL
  const model = process.env.AI_MODEL?.trim() || defaultModel
  const key = loopback
    ? undefined
    : process.env.AI_API_KEY?.trim() ||
      (groq ? process.env.GROQ_API_KEY?.trim() : undefined)

  if (!local && loopback && process.env.VERCEL === '1') {
    throw new Error(
      'Задайте CLOUDFLARE_ACCOUNT_ID и AI_API_KEY для импорта на Vercel.',
    )
  }
  if (cloudflare && !key) throw new Error('Задайте AI_API_KEY для Workers AI.')
  if (groq && !key)
    throw new Error('Задайте AI_API_KEY или GROQ_API_KEY для Groq.')

  return {
    baseUrl,
    key,
    model,
    groq,
    loopback,
    timeout: local || loopback ? 180_000 : 35_000,
  }
}

export type ModelConfig = ReturnType<typeof getModelConfig>

export async function getModelIssues(
  config: ModelConfig,
  fields: Record<string, string>,
  existingIssues: Issue[],
  signal?: AbortSignal,
) {
  const groqGpt = config.groq && config.model.startsWith('openai/gpt-oss')
  const body = JSON.stringify({
    model: config.model,
    temperature: 0.1,
    response_format:
      config.loopback || groqGpt
        ? {
            type: 'json_schema',
            json_schema: {
              name: 'vacancy_analysis',
              strict: true,
              schema: MODEL_RESPONSE_SCHEMA,
            },
          }
        : { type: 'json_object' },
    ...(groqGpt
      ? { reasoning_effort: 'low', max_completion_tokens: 4096 }
      : { max_tokens: 2400 }),
    messages: [
      { role: 'system', content: ANALYSIS_PROMPT },
      { role: 'user', content: JSON.stringify({ fields, existingIssues }) },
    ],
  })

  async function request() {
    const timeout = AbortSignal.timeout(config.timeout)
    return fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.key && { Authorization: `Bearer ${config.key}` }),
      },
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      body,
    })
  }

  let response = await request()
  if ([429, 502, 503, 504].includes(response.status)) {
    const retryAfter = Number(response.headers.get('retry-after'))
    await response.body?.cancel()
    const delay = retryAfter > 0 ? Math.min(retryAfter * 1000, 60_000) : 1500
    await setTimeout(delay, undefined, { signal })
    response = await request()
  }
  if (!response.ok)
    throw new Error(`ИИ API: HTTP ${response.status} (${config.model}).`)

  const result = CompletionSchema.safeParse(await response.json())
  if (!result.success)
    throw new Error(`ИИ вернул неполный ответ (${config.model}).`)
  try {
    return ModelResultSchema.parse(
      JSON.parse(result.data.choices[0].message.content),
    ).issues
  } catch {
    throw new Error(`ИИ вернул замечания в неверном формате (${config.model}).`)
  }
}
