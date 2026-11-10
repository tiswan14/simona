import type { BudgetItem } from '@prisma/client'

import {
  serializeBudgetItem,
  type SerializedBudgetItem,
} from '@/lib/budget/serializer'

export type BudgetTreeNode = SerializedBudgetItem & {
  children: BudgetTreeNode[]
}

export function buildBudgetHierarchy(
  items: BudgetItem[],
): BudgetTreeNode[] {
  const nodes = new Map<string, BudgetTreeNode>()

  for (const item of items) {
    nodes.set(item.id, {
      ...serializeBudgetItem(item),
      children: [],
    })
  }

  const roots: BudgetTreeNode[] = []

  for (const node of nodes.values()) {
    if (!node.parentId) {
      roots.push(node)
      continue
    }

    const parent = nodes.get(node.parentId)

    if (!parent) {
      throw new Error(
        `Parent ${node.parentId} tidak ditemukan untuk item ${node.id}`,
      )
    }

    parent.children.push(node)
  }

  const visited = new Set<string>()
  const stack = [...roots]

  while (stack.length > 0) {
    const node = stack.pop()!

    if (visited.has(node.id)) {
      throw new Error(`Siklus hierarki ditemukan pada item ${node.id}`)
    }

    visited.add(node.id)
    stack.push(...node.children)
  }

  if (visited.size !== items.length) {
    throw new Error('Ditemukan data anggaran yang tidak terhubung ke root')
  }

  return roots
}
