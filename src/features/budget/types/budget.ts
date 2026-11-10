export type BudgetLevel =
  | 'program'
  | 'kegiatan'
  | 'kelompok'
  | 'output'
  | 'komponen'
  | 'subkomponen'
  | 'akun'
  | 'detail'

export type BudgetAmount = number | string | null

export type BudgetNode = {
  id: string
  code: string
  name: string
  level: BudgetLevel
  sourceLine: number
  paguAwal: BudgetAmount
  pagu: BudgetAmount
  hitungManual: BudgetAmount
  revisi: BudgetAmount
  formula: string | null
  validasi: string | null
  sisa: BudgetAmount
  kodeIB?: string | null
  volume?: string | number | null
  satuan?: string | null
  harga?: BudgetAmount
  children?: BudgetNode[]
}