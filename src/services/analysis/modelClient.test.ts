import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { PROCESSING_CONFIG } from '@/shared/configs/processing.config'
import { getModelConfig } from './modelClient'

const modelEnv = [
  'AI_BASE_URL',
  'AI_API_KEY',
  'AI_MODEL',
  'CLOUDFLARE_ACCOUNT_ID',
  'VERCEL',
] as const

function withModelEnv(
  values: Partial<Record<(typeof modelEnv)[number], string>>,
  run: () => void,
) {
  const original = modelEnv.map((name) => [name, process.env[name]] as const)
  try {
    for (const name of modelEnv) delete process.env[name]
    Object.assign(process.env, values)
    run()
  } finally {
    for (const [name, value] of original) {
      if (value === undefined) delete process.env[name]
      else process.env[name] = value
    }
  }
}

test('local inference uses Qwen and gives the model time to answer', () => {
  withModelEnv({ AI_API_KEY: 'unused-cloud-token' }, () => {
    const config = getModelConfig()
    assert.equal(config.model, PROCESSING_CONFIG.OLLAMA_MODEL)
    assert.equal(config.baseUrl, PROCESSING_CONFIG.OLLAMA_URL)
    assert.equal(config.key, undefined)
    assert.ok(config.timeout > 35_000)
  })
})

test('Workers AI is selected on Vercel with account ID and token', () => {
  const accountId = '0'.repeat(32)
  withModelEnv(
    {
      VERCEL: '1',
      CLOUDFLARE_ACCOUNT_ID: accountId,
      AI_API_KEY: 'test-token',
    },
    () => {
      const cloud = getModelConfig()
      assert.equal(cloud.model, PROCESSING_CONFIG.CLOUDFLARE_MODEL)
      assert.equal(
        cloud.baseUrl,
        `${PROCESSING_CONFIG.CLOUDFLARE_API_URL}/${accountId}/ai/v1`,
      )
      assert.equal(cloud.key, 'test-token')
      assert.equal(getModelConfig(true).baseUrl, PROCESSING_CONFIG.OLLAMA_URL)
    },
  )
})
