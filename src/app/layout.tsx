
import type { Metadata } from 'next'
import { Source_Sans_3 } from 'next/font/google'
import './globals.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans',
})

export const metadata: Metadata = {
  title: 'SIMONA | BPS Kabupaten Pangandaran',
  description: 'Sistem Monitoring dan Analisis Anggaran BPS Kabupaten Pangandaran',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={sourceSans.variable}>
        {children}
      </body>
    </html>
  )
}
