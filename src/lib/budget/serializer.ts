import type { BudgetItem } from '@prisma/client'

type BigIntFields =
  | 'initialBudget'
  | 'currentBudget'
  | 'manualAmount'
  | 'sourceRevisionAmount'
  | 'sourceRemainingBudget'
  | 'unitPrice'

export type SerializedBudgetItem = Omit<BudgetItem, BigIntFields> & {
  initialBudget: string
  currentBudget: string
  manualAmount: string | null
  sourceRevisionAmount: string | null
  sourceRemainingBudget: string | null
  unitPrice: string | null
}

export function serializeBudgetItem(
  item: BudgetItem,
): SerializedBudgetItem {
  return {
    ...item,
    initialBudget: item.initialBudget.toString(),
    currentBudget: item.currentBudget.toString(),
    manualAmount: item.manualAmount?.toString() ?? null,
    sourceRevisionAmount: item.sourceRevisionAmount?.toString() ?? null,
    sourceRemainingBudget: item.sourceRemainingBudget?.toString() ?? null,
    unitPrice: item.unitPrice?.toString() ?? null,
  }
}
