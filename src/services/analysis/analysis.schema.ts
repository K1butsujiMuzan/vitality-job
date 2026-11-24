import { z } from 'zod'
import {
  ANALYSIS_TOPICS,
  ISSUE_KINDS,
} from '@/shared/constants/analysis.constant'
import type { IssueKind, IssueTopic } from '@/shared/types/analysis.type'

const EvidenceSchema = z.object({
  field: z.string().trim().min(1).max(150),
  quote: z.string().trim().max(450),
})

export const ModelResultSchema = z.object({
  issues: z
    .array(
      z.object({
        topic: z.enum(Object.keys(ANALYSIS_TOPICS) as IssueTopic[]),
        kind: z.enum(Object.keys(ISSUE_KINDS) as IssueKind[]),
        evidence: z.array(EvidenceSchema).min(1).max(2),
        problem: z.string().trim().min(1).max(600),
        recommendation: z.string().trim().min(1).max(600),
      }),
    )
    .max(21),
})

export const CompletionSchema = z.object({
  choices: z
    .tuple([
      z.object({
        finish_reason: z.literal('stop').nullish(),
        message: z.object({ content: z.string().min(1) }),
      }),
    ])
    .rest(z.unknown()),
})

const { properties, required } = z.toJSONSchema(ModelResultSchema)

export const MODEL_RESPONSE_SCHEMA = {
  type: 'object',
  properties,
  required,
  additionalProperties: false,
}
