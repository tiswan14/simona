
'use client'

import Image from 'next/image'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!username.trim() || !password) {
            toast.error('Username dan password wajib diisi')
            return
        }

        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                username: username.trim(),
                password,
                redirect: false,
            })

            if (!result || result.error) {
                toast.error('Username atau password salah')
                return
            }

            toast.success('Login berhasil')
            router.replace('/dashboard')
            router.refresh()
        } catch {
            toast.error('Terjadi kesalahan. Silakan coba lagi')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className='flex h-dvh w-full items-center justify-center overflow-hidden bg-[#F1F5F9] p-3 sm:p-5'>
            <div className='grid h-full w-full max-w-360 grid-rows-[0.85fr_1.15fr] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] lg:max-h-212.5 lg:grid-cols-2 lg:grid-rows-1 lg:rounded-3xl'>

                {/* Brand Panel */}
                <section className='relative flex min-h-0 flex-col justify-between overflow-hidden bg-[#0F5B78] px-6 py-5 text-white sm:px-10 sm:py-8 lg:px-12 lg:py-10 xl:px-16 xl:py-12'>
                    <div className='animate-fade-up relative z-10'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-lg sm:size-14 lg:size-16'>
                                <Image
                                    src='/logo-bps.svg'
                                    alt='Logo Badan Pusat Statistik'
                                    width={100}
                                    height={100}
                                    priority
                                    className='h-full w-full object-contain'
                                />
                            </div>

                            <div>
                                <h1 className='text-xl font-bold tracking-wide sm:text-2xl'>
                                    SIMONA
                                </h1>
                                <p className='mt-0.5 text-xs text-white/75 sm:text-sm'>
                                    BPS Kabupaten Pangandaran
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='animate-fade-up relative z-10 my-4 [animation-delay:150ms] lg:my-0'>
                        <div className='mb-4 h-1 w-12 rounded-full bg-[#67D5DC] sm:mb-6' />

                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-[#CCF0F5] sm:text-sm'>
                            Sistem Informasi Internal
                        </p>

                        <h2 className='mt-3 max-w-lg text-2xl font-bold leading-tight tracking-tight sm:mt-5 sm:text-3xl lg:text-4xl xl:text-5xl'>
                            Sistem Monitoring dan Analisis Anggaran
                        </h2>

                        <p className='mt-3 max-w-md text-xs leading-relaxed text-white/75 sm:mt-6 sm:text-sm sm:leading-7 lg:text-base'>
                            Mendukung pengelolaan dan pemantauan anggaran
                            BPS Kabupaten Pangandaran secara terintegrasi.
                        </p>
                    </div>

                    <div className='animate-fade-up relative z-10 border-t border-white/15 pt-3 [animation-delay:300ms] sm:pt-5 lg:pt-6'>
                        <p className='text-xs text-white/75 sm:text-sm'>
                            Badan Pusat Statistik Kabupaten Pangandaran
                        </p>
                        <p className='mt-1 text-[10px] text-white/50 sm:text-xs'>
                            © 2026 SIMONA
                        </p>
                    </div>
                </section>

                {/* Login Panel */}
                <section className='relative flex min-h-0 flex-col justify-center overflow-hidden bg-white px-6 py-5 sm:px-10 sm:py-8 lg:px-12 xl:px-20'>
                    <div className='animate-fade-up relative z-10 mx-auto w-full max-w-md'>
                        <div className='mb-6 sm:mb-8 lg:mb-10'>
                            <p className='text-xs font-bold uppercase tracking-[0.16em] text-[#0F5B78] sm:text-sm'>
                                LOGIN PENGGUNA
                            </p>

                            <h2 className='mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-3xl lg:text-4xl'>
                                Selamat datang
                            </h2>

                            <p className='mt-2 text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7'>
                                Masukkan akun Anda untuk melanjutkan
                                ke sistem SIMONA.
                            </p>
                        </div>

                        <form
                            className='animate-fade-up space-y-4 [animation-delay:150ms] sm:space-y-5'
                            onSubmit={handleSubmit}
                        >
                            <div className='space-y-2'>
                                <label
                                    htmlFor='username'
                                    className='block text-sm font-semibold text-slate-700'
                                >
                                    Username
                                </label>

                                <input
                                    id='username'
                                    name='username'
                                    type='text'
                                    placeholder='Masukkan username'
                                    autoComplete='username'
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    disabled={isLoading}
                                    required
                                    className='h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F5B78] focus:bg-white focus:ring-4 focus:ring-[#0F5B78]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 sm:text-base'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-semibold text-slate-700'
                                >
                                    Password
                                </label>

                                <div className='relative'>
                                    <input
                                        id='password'
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Masukkan password'
                                        autoComplete='current-password'
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        disabled={isLoading}
                                        required
                                        className='h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 pr-12 text-sm text-slate-900 outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F5B78] focus:bg-white focus:ring-4 focus:ring-[#0F5B78]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 sm:text-base'
                                    />

                                    <button
                                        type='button'
                                        onClick={() => setShowPassword((previous) => !previous)}
                                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#CCF0F5]/50 hover:text-[#0F5B78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5B78]'
                                    >
                                        {showPassword ? (
                                            <EyeOff className='size-5' />
                                        ) : (
                                            <Eye className='size-5' />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={isLoading}
                                className='flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F5B78] text-sm font-semibold text-white shadow-lg shadow-[#0F5B78]/15 transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#0B4962] hover:shadow-xl hover:shadow-[#0F5B78]/20 focus:outline-none focus:ring-4 focus:ring-[#0F5B78]/20 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:mt-2 sm:h-13 sm:text-base'
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className='size-5 animate-spin' />
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </form>

                        <div className='animate-fade-up mt-6 border-t border-slate-100 pt-4 [animation-delay:300ms] sm:mt-9 sm:pt-6 lg:mt-12'>
                            <p className='text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6'>
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
