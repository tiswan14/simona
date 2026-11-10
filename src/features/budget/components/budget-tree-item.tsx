
'use client'

import { useState } from 'react'

import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'

import type { BudgetNode } from '../types/budget'

import { LEVEL_LABELS, getNextLevel } from '../constant/budget-level'
import { getNodeIcon } from '../utils/budget-icons'
import { formatRupiah } from '../utils/budget-formatter'

type BudgetTreeItemProps = {
  node: BudgetNode
  depth: number
  selectedId: string | null
  onSelect: (node: BudgetNode) => void
  onCreate: (node: BudgetNode) => void
  onEdit: (node: BudgetNode) => void
  onDelete: (node: BudgetNode) => void
}

export function BudgetTreeItem({
  node,
  depth,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: BudgetTreeItemProps) {
  const [expanded, setExpanded] = useState(false)

  const children = node.children ?? []
  const hasChildren = children.length > 0
  const nextLevel = getNextLevel(node.level)

  const isSelected = selectedId === node.id
  const Icon = getNodeIcon(node.level)

  return (
    <div>
      <div
        className={`group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors ${isSelected ? 'bg-[#EAF1F5]' : 'hover:bg-slate-50'
          }`}
        style={{
          paddingLeft: `${8 + depth * 20}px`,
        }}
      >
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          disabled={!hasChildren}
          aria-label={expanded ? 'Tutup turunan' : 'Buka turunan'}
          className="flex size-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-200 disabled:invisible"
        >
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect(node)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F4F7] text-[#18384D]">
            <Icon className="size-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#18384D]">
                {node.code || 'Tanpa kode'}
              </span>

              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                {LEVEL_LABELS[node.level]}
              </span>
            </span>

            <span className="mt-1 block wrap-break-word text-sm font-medium text-[#344653]">
              {node.name}
            </span>
          </span>

          <span className="hidden shrink-0 text-right text-xs font-semibold text-[#344653] md:block">
            {formatRupiah(node.pagu)}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          {nextLevel && (
            <button
              type="button"
              title={`Tambah ${LEVEL_LABELS[nextLevel]}`}
              onClick={() => onCreate(node)}
              className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="size-4" />
            </button>
          )}

          <button
            type="button"
            title="Edit"
            onClick={() => onEdit(node)}
            className="rounded-md p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
          >
            <Pencil className="size-4" />
          </button>

          <button
            type="button"
            title="Hapus"
            onClick={() => onDelete(node)}
            className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <BudgetTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onCreate={onCreate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
