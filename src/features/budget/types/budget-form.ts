
import type { BudgetAmount, BudgetLevel } from './budget'

export type BudgetFormData = {
  id?: string
  parentId: string | null
  level: BudgetLevel
  code: string
  name: string
  paguAwal: BudgetAmount
  pagu: BudgetAmount
  hitungManual: BudgetAmount
  revisi: BudgetAmount
  sisa: BudgetAmount
  kodeIB: string
  volume: string
  satuan: string
  harga: BudgetAmount
  formula: string
  validasi: string
}
