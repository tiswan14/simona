
import Link from 'next/link'
import {
    Activity,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    ClipboardList,
    Clock3,
    FileBarChart,
    Wallet,
} from 'lucide-react'

const summaryCards = [
    {
        title: 'Total Anggaran',
        description: 'Keseluruhan pagu anggaran',
        icon: Wallet,
    },
    {
        title: 'Total Kegiatan',
        description: 'Kegiatan dalam anggaran',
        icon: ClipboardList,
    },
    {
        title: 'Realisasi Anggaran',
        description: 'Total anggaran terealisasi',
        icon: ArrowUpRight,
    },
    {
        title: 'Perlu Ditinjau',
        description: 'Data yang membutuhkan perhatian',
        icon: AlertCircle,
    },
]

const quickLinks = [
    {
        title: 'Data Anggaran',
        description: 'Kelola dan telusuri data anggaran',
        href: '/anggaran',
        icon: Wallet,
    },
    {
        title: 'Realisasi',
        description: 'Pantau perkembangan realisasi',
        href: '/realisasi',
        icon: Activity,
    },
    {
        title: 'Laporan',
        description: 'Lihat dan kelola laporan anggaran',
        href: '/laporan',
        icon: FileBarChart,
    },
]

function SummaryCard({
    title,
    description,
    icon: Icon,
}: {
    title: string
    description: string
    icon: typeof Wallet
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-[#F0F4F7] text-[#18384D]">
                    <Icon className="size-5" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                    Belum tersedia
                </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-[#243746]">
                —
            </p>

            <p className="mt-2 text-xs text-slate-400">
                {description}
            </p>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-[#B96C25]">
                        BPS Kabupaten Pangandaran
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#243746]">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Monitoring dan pengelolaan anggaran secara terpusat.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 className="size-4" />
                    <span>Ringkasan informasi anggaran</span>
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-[#243746]">
                            Ringkasan Anggaran
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Gambaran umum kondisi anggaran.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((item) => (
                        <SummaryCard
                            key={item.title}
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold text-[#243746]">
                                Perkembangan Anggaran
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Ringkasan pagu, realisasi, dan sisa anggaran.
                            </p>
                        </div>

                        <span className="w-fit rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                            Belum tersedia
                        </span>
                    </div>

                    <div className="mt-6 flex min-h-[230px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-white text-[#54748A] shadow-sm">
                            <FileBarChart className="size-6" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-[#344653]">
                            Belum ada data anggaran
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                            Visualisasi perkembangan anggaran akan ditampilkan
                            setelah sumber data dan perhitungan ditetapkan.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="size-5 text-[#B96C25]" />
                        <h2 className="font-semibold text-[#243746]">
                            Perhatian
                        </h2>
                    </div>

                    <div className="mt-5 flex min-h-[190px] flex-col items-center justify-center text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#FFF7ED] text-[#B96C25]">
                            <AlertCircle className="size-5" />
                        </div>

                        <p className="mt-4 text-sm font-medium text-[#344653]">
                            Belum ada informasi
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Informasi yang memerlukan perhatian akan muncul
                            berdasarkan data dan aturan yang telah ditetapkan.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-[#243746]">
                                Aktivitas Terbaru
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Riwayat aktivitas pengelolaan anggaran.
                            </p>
                        </div>

                        <Activity className="size-5 text-slate-400" />
                    </div>

                    <div className="mt-5 flex min-h-[130px] flex-col items-center justify-center rounded-lg bg-slate-50 px-4 text-center">
                        <Clock3 className="size-6 text-slate-400" />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                            Belum ada aktivitas
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Riwayat perubahan akan ditampilkan di sini.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div>
                        <h2 className="font-semibold text-[#243746]">
                            Akses Cepat
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Akses fitur utama SIMONA.
                        </p>
                    </div>

                    <div className="mt-5 space-y-2">
                        {quickLinks.map((item) => {
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F4F7] text-[#18384D]">
                                        <Icon className="size-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#344653]">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {item.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight className="size-4 text-slate-400 transition-colors group-hover:text-[#B96C25]" />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
