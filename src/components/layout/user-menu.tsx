'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import {
    ChevronDown,
    UserRound,
    LogOut,
    LoaderCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export default function UserMenu() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { data: session, status } = useSession()

    const roleLabels: Record<string, string> = {
        ADMIN: 'Admin',
        PEGAWAI: 'Pegawai',
        KEPALA_BPS: 'Kepala BPS',
    }

    const userName = session?.user?.name || 'Pengguna'
    const userRole = session?.user?.role
        ? roleLabels[session.user.role] || 'Pengguna internal'
        : 'Pengguna internal'

    async function handleLogout() {
        setIsLoading(true)

        try {
            await signOut({
                redirect: true,
                redirectTo: '/login',
            })
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Gagal keluar dari akun')
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className='flex items-center gap-3 px-2 py-2'>
                <div className='size-9 animate-pulse rounded-full bg-slate-200' />

                <div className='hidden space-y-2 sm:block'>
                    <div className='h-3 w-24 animate-pulse rounded bg-slate-200' />
                    <div className='h-2 w-16 animate-pulse rounded bg-slate-100' />
                </div>
            </div>
        )
    }

    if (!session?.user) {
        return null
    }

    return (
        <div className='relative'>
            {/* User Button */}
            <button
                type='button'
                onClick={() => setOpen((previous) => !previous)}
                aria-expanded={open}
                aria-haspopup='true'
                className='flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-50'
            >
                <div className='flex size-9 items-center justify-center rounded-full bg-[#E9EEF1] text-[#18384D]'>
                    <UserRound className='size-5' />
                </div>

                <div className='hidden text-left sm:block'>
                    <p className='max-w-40 truncate text-sm font-semibold text-[#243746]'>
                        {userName}
                    </p>

                    <p className='text-xs text-slate-500'>
                        BPS Kab. Pangandaran
                    </p>
                </div>

                <ChevronDown
                    className={`hidden size-4 text-slate-400 transition-transform sm:block ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Click Outside */}
                    <button
                        type='button'
                        aria-label='Tutup menu'
                        onClick={() => setOpen(false)}
                        className='fixed inset-0 z-20 cursor-pointer'
                    />

                    <div className='absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg'>
                        {/* User Information */}
                        <div className='border-b border-slate-100 pb-3'>
                            <p className='text-sm font-semibold text-[#243746]'>
                                {userName}
                            </p>
{/* 
                            <p className='mt-1 text-xs text-slate-500'>
                                {userRole}
                            </p> */}

                            <p className='mt-1 text-xs text-slate-400'>
                                BPS Kabupaten Pangandaran
                            </p>
                        </div>

                        {/* Logout */}
                        <div className='mt-3'>
                            <button
                                type='button'
                                onClick={handleLogout}
                                disabled={isLoading}
                                className='flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                {isLoading ? (
                                    <LoaderCircle className='size-4 animate-spin' />
                                ) : (
                                    <LogOut className='size-4' />
                                )}

                                {isLoading ? 'Keluar...' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}