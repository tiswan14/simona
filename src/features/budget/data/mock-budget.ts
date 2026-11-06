
export type BudgetStatus = 'Valid' | 'Perlu diperiksa'

export type BudgetItem = {
    code: string
    name: string
    pagu: number
    status: BudgetStatus
    note: string
}

export const budgetItems: BudgetItem[] = [
    {
        code: '2896',
        name: 'Analisis Statistik, Tata Kelola Data Statistik Pembangunan, dan Neraca Satelit',
        pagu: 170000,
        status: 'Valid',
        note: 'Tidak ditemukan penanda validasi FALSE pada sampel kegiatan',
    },
    {
        code: '2897',
        name: 'Diseminasi, Pemberdayaan, dan Evaluasi Penyelenggaraan Statistik',
        pagu: 3040000,
        status: 'Valid',
        note: 'Contoh data kegiatan diseminasi',
    },
    {
        code: '2898',
        name: 'Penyediaan dan Pengembangan Statistik Neraca Pengeluaran',
        pagu: 15380000,
        status: 'Perlu diperiksa',
        note: 'Komponen 005 memiliki penanda validasi FALSE',
    },
    {
        code: '2899',
        name: 'Penyediaan dan Pengembangan Statistik Neraca Produksi',
        pagu: 17226000,
        status: 'Perlu diperiksa',
        note: 'RO 006 memiliki penanda validasi FALSE',
    },
]

export function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value)
}
