
export function formatRupiah(
  value: number | string | bigint | null | undefined,
) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  try {
    const amount = BigInt(value)

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return '—'
  }
}

export function parseNumber(value: string) {
  if (!value.trim()) return null

  const parsed = Number(value.replace(/[^\d-]/g, ''))

  return Number.isFinite(parsed) ? parsed : null
}
