
import { z } from 'zod'

import { BUDGET_LEVELS, PARENT_LEVEL } from '@/lib/budget/constant'

const bigIntInputSchema = z.union([
  z.string()
    .trim()
    .regex(/^\d+$/, 'Harus berupa bilangan bulat non-negatif')
    .transform((value) => BigInt(value)),

  z.number()
    .int()
    .nonnegative()
    .safe()
    .transform((value) => BigInt(value)),

  z.bigint().nonnegative(),
])

const nullableTextSchema = z.string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional()

const budgetFields = {
  name: z.string()
    .trim()
    .min(1, 'Nama anggaran wajib diisi'),

  code: nullableTextSchema,
  ibCode: nullableTextSchema,

  sortOrder: z.number()
    .int()
    .nonnegative()
    .optional(),

  volume: z.number()
    .finite()
    .nonnegative()
    .nullable()
    .optional(),

  unit: nullableTextSchema,
  unitPrice: bigIntInputSchema.nullable().optional(),

  initialBudget: bigIntInputSchema.optional(),
  currentBudget: bigIntInputSchema.optional(),

  isValid: z.boolean().nullable().optional(),
  notes: nullableTextSchema,
}

const detailFields = [
  'volume',
  'unit',
  'unitPrice',
] as const

export const createBudgetSchema = z.object({
  periodId: z.string()
    .trim()
    .min(1, 'Periode anggaran wajib dipilih'),

  parentId: z.string()
    .trim()
    .min(1, 'Parent ID tidak boleh kosong')
    .nullable()
    .optional(),

  level: z.enum(BUDGET_LEVELS),

  ...budgetFields,
}).strict().superRefine((data, ctx) => {
  const expectedParent = PARENT_LEVEL[data.level]

  if (expectedParent === null && data.parentId) {
    ctx.addIssue({
      code: 'custom',
      path: ['parentId'],
      message: 'PROGRAM tidak boleh memiliki parent',
    })
  }

  if (expectedParent !== null && !data.parentId) {
    ctx.addIssue({
      code: 'custom',
      path: ['parentId'],
      message: `${data.level} wajib memiliki parent ${expectedParent}`,
    })
  }

  if (
    data.level !== 'DETIL' &&
    detailFields.some((field) => data[field] !== undefined)
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['level'],
      message: 'Volume, satuan, dan harga hanya dapat diisi pada DETIL',
    })
  }
})

export const updateBudgetSchema = z.object({
  ...budgetFields,

  formula: nullableTextSchema,
  validationNote: nullableTextSchema,
}).partial().strict().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'Minimal satu field harus diubah',
  },
)

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>
