'use client'

import { Search, X } from 'lucide-react'

type BudgetToolbarProps = {
  keyword: string
  onKeywordChange: (value: string) => void
  onReset: () => void
}

export function BudgetToolbar({
  keyword,
  onKeywordChange,
  onReset,
}: BudgetToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Cari kode atau nama anggaran..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none focus:border-[#54748A] focus:ring-2 focus:ring-[#54748A]/10"
        />

        {keyword && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}