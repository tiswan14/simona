
import type { BudgetLevel } from '../types/budget'

export const BUDGET_LEVELS = [
  'program',
  'kegiatan',
  'kelompok',
  'output',
  'komponen',
  'subkomponen',
  'akun',
  'detail',
] as const satisfies readonly BudgetLevel[]

export const LEVEL_LABELS: Record<BudgetLevel, string> = {
  program: 'Program',
  kegiatan: 'Kegiatan',
  kelompok: 'Kelompok',
  output: 'Output',
  komponen: 'Komponen',
  subkomponen: 'Subkomponen',
  akun: 'Akun belanja',
  detail: 'Detail belanja',
}

export function getNextLevel(level: BudgetLevel): BudgetLevel | null {
  const index = BUDGET_LEVELS.indexOf(level)

  return BUDGET_LEVELS[index + 1] ?? null
}
