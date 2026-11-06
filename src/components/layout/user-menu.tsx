
'use client'

import { useState } from 'react'
import { ChevronDown, UserRound } from 'lucide-react'

export default function UserMenu() {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-expanded={open}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-50"
            >
                <div className="flex size-9 items-center justify-center rounded-full bg-[#E9EEF1] text-[#18384D]">
                    <UserRound className="size-5" />
                </div>

                <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-[#243746]">
                        Pengguna SIMONA
                    </p>
                    <p className="text-xs text-slate-500">
                        Pengguna internal
                    </p>
                </div>

                <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                    <p className="text-sm font-semibold text-[#243746]">
                        Akun SIMONA
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        BPS Kabupaten Pangandaran
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
