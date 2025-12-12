'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Settings, LogOut, BarChart3, Presentation } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Power BI Reports', href: '/dashboard/reports', icon: Presentation },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 flex-col bg-slate-900 text-white shadow-xl transition-all duration-300 md:flex hidden z-50">
            <div className="flex h-16 items-center justify-center border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                   Ingeniería de Datos
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                            )}
                            <Icon className={clsx("h-5 w-5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-slate-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
