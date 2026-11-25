import { z } from 'zod'

export const SourceVacancySchema = z.looseObject({
  id: z
    .union([z.string(), z.number()])
    .transform(String)
    .pipe(
      z
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9_-]{1,128}$/),
    ),
})

export const SourcePageSchema = z.object({
  status: z.union([z.literal('200'), z.literal(200)]).optional(),
  meta: z
    .object({ total: z.coerce.number().int().nonnegative().optional() })
    .optional(),
  results: z.object({
    vacancies: z.array(z.object({ vacancy: SourceVacancySchema })),
  }),
})

export type SourceVacancy = z.infer<typeof SourceVacancySchema>

export const readSourcePages = (data: unknown) =>
  (Array.isArray(data) ? data : [data]).map((page) =>
    SourcePageSchema.parse(page),
  )
