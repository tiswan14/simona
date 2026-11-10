import { formatRupiah } from '../utils/budget-formatter'

type BudgetSummaryProps = {
  totalPagu: number | string | bigint | null
  allNodes: number
}

export function BudgetSummary({
  totalPagu,
  allNodes,
}: BudgetSummaryProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500">
          Total pagu program
        </p>

        <p className="mt-2 text-xl font-bold text-[#243746]">
          {formatRupiah(totalPagu)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500">
          Jumlah seluruh data
        </p>

        <p className="mt-2 text-xl font-bold text-[#243746]">
          {allNodes.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500">
          Sumber data
        </p>

        <p className="mt-2 text-xl font-bold text-emerald-700">
          Database
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Data ditampilkan melalui GET API
        </p>
      </div>
    </section>
  )
}