
'use client'

import Image from 'next/image'
import { useState } from 'react'

function EyeIcon({ visible }: { visible: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
            aria-hidden="true"
        >
            {visible ? (
                <>
                    <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="m3 3 18 18" />
                    <path d="M10.6 5.6A10.5 10.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15 15 0 0 1-3.1 3.8" />
                    <path d="M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.2 0 2.3-.3 3.3-.8" />
                </>
            )}
        </svg>
    )
}

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F2F3F4] px-4 py-8 sm:px-8">
            <div className="grid min-h-180 w-full max-w-6xl overflow-hidden rounded-2xl border border-[#E3E6E8] bg-white shadow-sm lg:grid-cols-2">

                {/* Brand Panel */}
                <section className="flex flex-col justify-between bg-[#18384D] px-8 py-10 text-white sm:px-12 sm:py-12 lg:px-14 lg:py-14">
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-white p-2">
                                <Image
                                    src="/logo-bps.svg"
                                    alt="Logo Badan Pusat Statistik"
                                    width={100}
                                    height={100}
                                    priority
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-wide">
                                    SIMONA
                                </h1>
                                <p className="mt-1 text-sm text-white/70">
                                    BPS Kabupaten Pangandaran
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="my-16 lg:my-0">
                        <div className="mb-6 h-1 w-12 rounded-full bg-[#E99A48]" />

                        <p className="text-sm font-semibold uppercase tracking-wider text-[#E99A48]">
                            Sistem Informasi Internal
                        </p>

                        <h2 className="mt-5 max-w-md text-3xl font-semibold leading-snug sm:text-4xl">
                            Sistem Monitoring dan Analisis Anggaran
                        </h2>

                        <p className="mt-6 max-w-md text-base leading-8 text-white/70">
                            Mendukung pengelolaan dan pemantauan anggaran
                            BPS Kabupaten Pangandaran secara terintegrasi.
                        </p>
                    </div>

                    <div className="border-t border-white/15 pt-6">
                        <p className="text-sm text-white/60">
                            Badan Pusat Statistik Kabupaten Pangandaran
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                            © 2026 SIMONA
                        </p>
                    </div>
                </section>

                {/* Login Panel */}
                <section className="flex flex-col justify-center px-7 py-12 sm:px-14 lg:px-16 xl:px-20">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-10">
                            <p className="text-sm font-semibold text-[#C47A31]">
                                LOGIN PENGGUNA
                            </p>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#243746] sm:text-4xl">
                                Selamat datang
                            </h2>

                            <p className="mt-4 text-base leading-7 text-[#77838B]">
                                Masukkan akun Anda untuk melanjutkan
                                ke sistem SIMONA.
                            </p>
                        </div>

                        <form
                            className="space-y-6"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-[#344653]"
                                >
                                    Alamat email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nama@bps.go.id"
                                    autoComplete="username"
                                    required
                                    className="h-13 w-full rounded-lg border border-[#DCE1E4] bg-white px-4 text-base text-[#243746] outline-none transition placeholder:text-[#A0A8AC] focus:border-[#18384D] focus:ring-2 focus:ring-[#18384D]/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-[#344653]"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan password"
                                        autoComplete="current-password"
                                        required
                                        className="h-13 w-full rounded-lg border border-[#DCE1E4] bg-white px-4 pr-14 text-base text-[#243746] outline-none transition placeholder:text-[#A0A8AC] focus:border-[#18384D] focus:ring-2 focus:ring-[#18384D]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((previous) => !previous)}
                                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89949B] transition hover:text-[#18384D]"
                                    >
                                        <EyeIcon visible={showPassword} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <label className="flex cursor-pointer items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        className="size-4 accent-[#18384D]"
                                    />
                                    <span className="text-sm text-[#65737C]">
                                        Ingat saya
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    className="text-sm font-semibold text-[#B96C25] hover:underline"
                                >
                                    Lupa password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="h-13 w-full rounded-lg bg-[#18384D] text-base font-semibold text-white transition hover:bg-[#244D65] focus:outline-none focus:ring-2 focus:ring-[#18384D] focus:ring-offset-2"
                            >
                                Masuk
                            </button>
                        </form>

                        <div className="mt-12 border-t border-[#E8EAEB] pt-6">
                            <p className="text-sm leading-6 text-[#929BA0]">
                                Akses terbatas untuk pegawai dan pengguna
                                yang memiliki izin resmi BPS Kabupaten Pangandaran.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
