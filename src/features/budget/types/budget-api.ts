
export type ApiBudgetLevel =
  | 'PROGRAM'
  | 'KEGIATAN'
  | 'KRO'
  | 'RO'
  | 'KOMPONEN'
  | 'SUBKOMPONEN'
  | 'AKUN'
  | 'DETIL'

export type BudgetApiItem = {
  id: string
  parentId: string | null
  level: ApiBudgetLevel
  code: string | null
  name: string
  sourceRow: number | null
  initialBudget: string
  currentBudget: string
  manualAmount: string | null
  sourceRevisionAmount: string | null
  sourceRemainingBudget: string | null
  unitPrice: string | null
  ibCode: string | null
  volume: number | null
  unit: string | null
  formula: string | null
  isValid: boolean | null
  children: BudgetApiItem[]
}

export type BudgetApiPeriod = {
  id: string
  year: number
  name: string
  status: string
}

export type BudgetApiSummary = {
  totalItems: number
}

export type BudgetApiResponse = {
  success: boolean
  message: string
  data: {
    period: BudgetApiPeriod | null
    summary: BudgetApiSummary
    items: BudgetApiItem[]
  }
}
