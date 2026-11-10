
import type { BudgetNode } from '../types/budget'

export function findNode(
  nodes: BudgetNode[],
  id: string,
): BudgetNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    const found = findNode(node.children ?? [], id)

    if (found) {
      return found
    }
  }

  return null
}

export function updateTree(
  nodes: BudgetNode[],
  id: string,
  updater: (node: BudgetNode) => BudgetNode,
): BudgetNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return updater(node)
    }

    return {
      ...node,
      children: updateTree(node.children ?? [], id, updater),
    }
  })
}

export function addToTree(
  nodes: BudgetNode[],
  parentId: string | null,
  newNode: BudgetNode,
): BudgetNode[] {
  if (parentId === null) {
    return [...nodes, newNode]
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children ?? []), newNode],
      }
    }

    return {
      ...node,
      children: addToTree(node.children ?? [], parentId, newNode),
    }
  })
}

export function deleteFromTree(
  nodes: BudgetNode[],
  id: string,
): BudgetNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: deleteFromTree(node.children ?? [], id),
    }))
}
