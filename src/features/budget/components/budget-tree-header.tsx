import { Plus, Search, X } from 'lucide-react'

type BudgetTreeHeaderProps = {
  allNodes: number
  search: string
  onSearchChange: (value: string) => void
  onCreateProgram: () => void
}

export function BudgetTreeHeader({
  search,
  onSearchChange,
  onCreateProgram,
}: BudgetTreeHeaderProps) {
  return (
    <div className="border-b border-slate-200 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold text-[#243746]">
            Struktur Anggaran
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Telusuri hierarki anggaran dari program hingga detail belanja.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">


          <button
            type="button"
            onClick={onCreateProgram}
            className="cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg bg-[#18384D] px-3 text-sm font-medium text-white transition-colors hover:bg-[#244D66]"
          >
            <Plus className="size-4" />
            Tambah Program
          </button>
        </div>
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari kode atau nama anggaran..."
          className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-10 text-sm outline-none transition-colors focus:border-[#54748A] focus:ring-2 focus:ring-[#54748A]/10"
        />

        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
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