
import { Wallet } from 'lucide-react'

type BudgetEmptyStateProps = {
  title: string
  description: string
}

export function BudgetEmptyState({
  title,
  description,
}: BudgetEmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <Wallet className="size-10 text-slate-300" />

      <p className="mt-4 text-sm font-semibold text-slate-600">
        {title}
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  )
}
