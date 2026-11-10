
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Wallet,
    ReceiptText,
    CalendarDays,
    ChartNoAxesCombined,
    ShieldCheck,
    FileText,
    Settings,
    X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
    label: string
    href: string
    icon: LucideIcon
}

type NavGroup = {
    label: string
    items: NavItem[]
}

type SidebarProps = {
    open: boolean
    onClose: () => void
}

const navGroups: NavGroup[] = [
    {
        label: 'MENU UTAMA',
        items: [
            {
                label: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'MANAJEMEN',
        items: [
            {
                label: 'Anggaran',
                href: '/anggaran',
                icon: Wallet,
            },
            {
                label: 'Realisasi',
                href: '/realisasi',
                icon: ReceiptText,
            },
            {
                label: 'Kegiatan',
                href: '/kegiatan',
                icon: CalendarDays,
            },
        ],
    },
    {
        label: 'ANALISIS',
        items: [
            {
                label: 'Analisis Anggaran',
                href: '/analisis',
                icon: ChartNoAxesCombined,
            },
            {
                label: 'Validasi Data',
                href: '/validasi',
                icon: ShieldCheck,
            },
            {
                label: 'Laporan',
                href: '/laporan',
                icon: FileText,
            },
        ],
    },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Tutup navigasi"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#18384D] text-white transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Brand */}
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-white p-1.5">
                            <Image
                                src="/logo-bps.svg"
                                alt="Logo BPS"
                                width={44}
                                height={44}
                                className="size-full object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-wide">
                                SIMONA
                            </h1>
                            <p className="text-xs text-white/60">
                                BPS Kabupaten Pangandaran
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        onClick={onClose}
                        className="rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
                    {navGroups.map((group) => (
                        <div key={group.label}>
                            <p className="mb-3 px-3 text-[11px] font-semibold tracking-widest text-white/40">
                                {group.label}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon
                                    const active = pathname === item.href ||
                                        pathname.startsWith(`${item.href}/`)

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            aria-current={active ? 'page' : undefined}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${active
                                                ? 'bg-white text-[#18384D]'
                                                : 'text-white/75 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="size-4.5 shrink-0" />
                                            <span>{item.label}</span>

                                            {active && (
                                                <span className="ml-auto size-1.5 rounded-full bg-[#E99A48]" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-white/10 p-5">
                    <Link
                        href="/pengaturan"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <Settings className="size-4.5" />
                        Pengaturan
                    </Link>

                    <p className="mt-5 px-3 text-xs text-white/40">
                        SIMONA © 2026
                    </p>
                </div>
            </aside>
        </>
    )
}
