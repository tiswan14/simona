import { Wallet } from 'lucide-react'

export function BudgetHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#18384D]">
          Anggaran
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Kelola dan pantau struktur anggaran berdasarkan periode.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Wallet className="size-5 text-[#54748A]" />
        <span className="text-sm font-medium text-slate-600">
          Manajemen Anggaran
        </span>
      </div>
    </div>
  )
}