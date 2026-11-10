
export const BUDGET_LEVELS = [
  'PROGRAM',
  'KEGIATAN',
  'KRO',
  'RO',
  'KOMPONEN',
  'SUBKOMPONEN',
  'AKUN',
  'DETIL',
] as const

export type BudgetLevel = (typeof BUDGET_LEVELS)[number]

export const PARENT_LEVEL = {
  PROGRAM: null,
  KEGIATAN: 'PROGRAM',
  KRO: 'KEGIATAN',
  RO: 'KRO',
  KOMPONEN: 'RO',
  SUBKOMPONEN: 'KOMPONEN',
  AKUN: 'SUBKOMPONEN',
  DETIL: 'AKUN',
} as const satisfies Record<BudgetLevel, BudgetLevel | null>

export const USER_ROLES = [
  'ADMIN',
  'PEGAWAI',
  'KEPALA_BPS',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export function isBudgetLevel(value: unknown): value is BudgetLevel {
  return (
    typeof value === 'string' &&
    (BUDGET_LEVELS as readonly string[]).includes(value)
  )
}

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (USER_ROLES as readonly string[]).includes(value)
  )
}
