import { decode } from 'html-entities'
import type { SourceVacancy } from './trudvsem.schema'

export function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

export function valueList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value == null ? [] : [value]
}

export function textValue(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null

  return (
    decode(String(value))
      .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, '')
      .replace(/<\/?(?:br|p|li|div|ul|ol)\b[^>]*>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() || null
  )
}

export function numberValue(value: unknown): number | null {
  const text = textValue(value)
  if (!text || !/^\d+$/.test(text)) return null
  const number = Number(text)
  return Number.isSafeInteger(number) ? number : null
}

export function safeUrl(value: unknown): string | null {
  try {
    const url = new URL(String(value))
    return (url.protocol === 'https:' || url.protocol === 'http:') &&
      !url.username &&
      !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

export function getSourceAddresses(raw: SourceVacancy) {
  return valueList(objectValue(raw.addresses).address).flatMap(
    (address, index) => {
      const value = textValue(objectValue(address).location ?? address)
      return value
        ? [[`addresses.address[${index}].location`, value] as const]
        : []
    },
  )
}

export function getSourceList(value: unknown) {
  return (
    valueList(value)
      .map((item) => {
        const data = objectValue(item)
        return textValue(
          data.name ?? data.title ?? data.text ?? data.value ?? item,
        )
      })
      .filter((text): text is string => Boolean(text))
      .join('\n') || null
  )
}
