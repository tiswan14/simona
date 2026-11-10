'use client'

import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

import UserMenu from './user-menu'

type HeaderProps = {
    onMenuClick: () => void
}

type PageInfo = {
    title: string
    description: string
}

const pageTitles: Record<string, PageInfo> = {
    '/dashboard': {
        title: 'Dashboard',
        description: 'Ringkasan monitoring anggaran',
    },
    '/anggaran': {
        title: 'Anggaran',
        description: 'Pengelolaan dan pemantauan pagu anggaran',
    },
    '/realisasi': {
        title: 'Realisasi',
        description: 'Pemantauan realisasi anggaran',
    },
    '/kegiatan': {
        title: 'Kegiatan',
        description: 'Pengelolaan kegiatan dan aktivitas',
    },
    '/analisis': {
        title: 'Analisis Anggaran',
        description: 'Analisis dan evaluasi anggaran',
    },
    '/validasi': {
        title: 'Validasi Data',
        description: 'Pemeriksaan konsistensi data anggaran',
    },
    '/laporan': {
        title: 'Laporan',
        description: 'Rekapitulasi dan laporan anggaran',
    },
    '/pengaturan': {
        title: 'Pengaturan',
        description: 'Konfigurasi sistem SIMONA',
    },
    '/users': {
        title: 'Manajemen Pengguna',
        description: 'Pengelolaan akun dan hak akses pengguna',
    },
}

export default function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname()

    const matchedPath = Object.keys(pageTitles)
        .sort((a, b) => b.length - a.length)
        .find(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
        )

    const currentPage = matchedPath
        ? pageTitles[matchedPath]
        : {
            title: 'SIMONA',
            description: 'Sistem Monitoring dan Analisis Anggaran',
        }

    return (
        <header className='sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-3'>
                <button
                    type='button'
                    aria-label='Buka navigasi'
                    onClick={onMenuClick}
                    className='rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden'
                >
                    <Menu className='size-5' />
                </button>

                <div>
                    <h2 className='text-lg font-bold text-[#243746]'>
                        {currentPage.title}
                    </h2>

                    <p className='hidden text-sm text-slate-500 sm:block'>
                        {currentPage.description}
                    </p>
                </div>
            </div>

            <UserMenu />
        </header>
    )
}