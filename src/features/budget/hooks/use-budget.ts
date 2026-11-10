'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { BudgetNode } from '../types/budget'
import type { BudgetApiResponse } from '../types/budget-api'

import { mapBudgetItems } from '../utils/budget-adapter'

function countBudgetNodes(nodes: BudgetNode[]): number {
  return nodes.reduce(
    (total, node) => total + 1 + countBudgetNodes(node.children ?? []),
    0,
  )
}

function calculateTotalBudget(nodes: BudgetNode[]): bigint {
  return nodes.reduce(
    (total, node) => total + BigInt(node.pagu ?? 0),
    0n,
  )
}

export function useBudget() {
  const [tree, setTree] = useState<BudgetNode[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [periodName, setPeriodName] = useState<string | null>(null)

  const loadBudget = useCallback(async (signal?: AbortSignal) => {
    try {
      setError(null)

      const response = await fetch('/api/anggaran', {
        method: 'GET',
        cache: 'no-store',
        signal,
      })

      const result = await response.json() as BudgetApiResponse

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Gagal mengambil data anggaran',
        )
      }

      if (!result.data || !Array.isArray(result.data.items)) {
        throw new Error('Format respons data anggaran tidak valid')
      }

      setTree(mapBudgetItems(result.data.items))
      setPeriodName(result.data.period?.name ?? null)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengambil data anggaran',
      )
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function initialize() {
      setLoading(true)

      try {
        await loadBudget(controller.signal)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void initialize()

    return () => controller.abort()
  }, [loadBudget])

  const handleRefresh = async () => {
    setRefreshing(true)

    try {
      await loadBudget()
    } finally {
      setRefreshing(false)
    }
  }

  const allNodes = useMemo(
    () => countBudgetNodes(tree),
    [tree],
  )

  const totalPagu = useMemo(
    () => calculateTotalBudget(tree),
    [tree],
  )

  return {
    tree,
    setTree,
    loading,
    refreshing,
    error,
    periodName,
    allNodes,
    totalPagu,
    handleRefresh,
  }
}
