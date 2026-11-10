
import type {
  BudgetLevel,
  BudgetNode,
} from '../types/budget'

import type {
  ApiBudgetLevel,
  BudgetApiItem,
} from '../types/budget-api'

const LEVEL_MAPPING: Record<ApiBudgetLevel, BudgetLevel> = {
  PROGRAM: 'program',
  KEGIATAN: 'kegiatan',
  KRO: 'kelompok',
  RO: 'output',
  KOMPONEN: 'komponen',
  SUBKOMPONEN: 'subkomponen',
  AKUN: 'akun',
  DETIL: 'detail',
}

export function mapBudgetItem(item: BudgetApiItem): BudgetNode {
  return {
    id: item.id,
    code: item.code ?? '',
    name: item.name,
    level: LEVEL_MAPPING[item.level],
    sourceLine: item.sourceRow ?? 0,
    paguAwal: item.initialBudget,
    pagu: item.currentBudget,
    hitungManual: item.manualAmount,
    revisi: item.sourceRevisionAmount,
    sisa: item.sourceRemainingBudget,
    harga: item.unitPrice,
    kodeIB: item.ibCode,
    volume: item.volume,
    satuan: item.unit,
    formula: item.formula,
    validasi: item.isValid === null
      ? null
      : item.isValid
        ? 'TRUE'
        : 'FALSE',
    children: item.children.map(mapBudgetItem),
  }
}

export function mapBudgetItems(items: BudgetApiItem[]): BudgetNode[] {
  return items.map(mapBudgetItem)
}
