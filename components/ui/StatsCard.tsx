import React from 'react'

interface StatsCardProps {
    title: string
    value: string
    change?: string
    icon: React.ElementType
    loading?: boolean
}

export function StatsCard({ title, value, change, icon: Icon, loading = false }: StatsCardProps) {
    return (
        <div className="rounded-2xl glass card-hover p-6 group relative overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-cyan-600/0 to-emerald-600/0 group-hover:from-blue-600/5 group-hover:via-cyan-600/5 group-hover:to-emerald-600/5 transition-all duration-500"></div>

            <div className="relative z-10">
                <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <h3 className="tracking-tight text-xs font-semibold uppercase text-slate-500 group-hover:text-slate-400 transition-colors letter-spacing-wide">
                        {title}
                    </h3>
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 group-hover:from-blue-600/20 group-hover:to-cyan-600/20 border border-slate-700/50 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                </div>
                <div>
                    {loading ? (
                        <div className="h-10 w-32 shimmer rounded-lg mb-2" />
                    ) : (
                        <div className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-cyan-300 group-hover:to-blue-300 transition-all duration-500 leading-none mb-1">
                            {value}
                        </div>
                    )}
                    {change && (
                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                                {change}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
