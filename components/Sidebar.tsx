'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Settings, LogOut, BarChart3, Presentation, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Power BI Reports', href: '/dashboard/reports', icon: Presentation },
    { name: 'About this project', href: '/dashboard/about', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-slate-900/90 backdrop-blur-sm border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Toggle menu"
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={clsx(
                "fixed left-0 top-0 h-screen w-64 flex-col glass-strong text-white shadow-2xl transition-all duration-300 z-50 border-r border-slate-800/60",
                "md:flex",
                isMobileOpen ? "flex" : "hidden"
            )}>
                <div className="flex h-20 items-center justify-center border-b border-slate-800/60 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-cyan-600/5"></div>
                    <h1 className="text-xl font-bold gradient-text relative z-10">
                        World Happiness
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                    "hover:scale-[1.02] active:scale-[0.98]",
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600/20 via-cyan-600/15 to-blue-600/20 text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-500/20"
                                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 hover:border-slate-700/50 border border-transparent"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {isActive && (
                                    <>
                                        <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.6)]" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/5 to-transparent"></div>
                                    </>
                                )}
                                <Icon className={clsx(
                                    "h-5 w-5 transition-all duration-300 group-hover:scale-110 relative z-10",
                                    isActive ? "text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-slate-500 group-hover:text-slate-200"
                                )} />
                                <span className="relative z-10 font-medium">{item.name}</span>
                                {!isActive && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="border-t border-slate-800/60 p-4 bg-gradient-to-t from-slate-950/50 to-transparent">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <LogOut className="h-5 w-5 transition-transform group-hover:rotate-12 relative z-10" />
                        <span className="relative z-10">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

