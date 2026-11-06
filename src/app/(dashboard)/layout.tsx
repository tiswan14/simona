
'use client'

import { useState, type ReactNode } from 'react'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="min-h-screen lg:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
