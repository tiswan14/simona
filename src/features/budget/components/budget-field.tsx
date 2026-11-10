
type BudgetFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}

export function BudgetField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: BudgetFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        min={type === 'number' ? 0 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-[#54748A] focus:ring-2 focus:ring-[#54748A]/10"
      />
    </label>
  )
}
