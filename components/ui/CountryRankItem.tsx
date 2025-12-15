import React from 'react'
import clsx from 'clsx'

interface CountryRankItemProps {
    rank: number
    country: string
    region: string
    score: number
    index?: number
}

export function CountryRankItem({ rank, country, region, score, index = 0 }: CountryRankItemProps) {
    return (
        <div
            className="flex items-center justify-between p-4 rounded-xl border border-slate-800/60 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-slate-700/60 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden animate-slide-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-emerald-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className={clsx(
                    "h-12 w-12 rounded-xl flex items-center justify-center font-extrabold text-base transition-all duration-300 group-hover:scale-110 shadow-lg",
                    rank === 1
                        ? "bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 text-yellow-300 border-2 border-yellow-500/40 glow-blue"
                        : rank === 2
                            ? "bg-gradient-to-br from-slate-400/30 to-slate-500/30 text-slate-200 border-2 border-slate-500/40"
                            : rank === 3
                                ? "bg-gradient-to-br from-amber-600/30 to-amber-700/30 text-amber-300 border-2 border-amber-600/40"
                                : "bg-slate-800/60 text-slate-400 border-2 border-slate-700/60"
                )}>
                    {rank}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">{country}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{region}</p>
                </div>
            </div>
            <div className="relative z-10">
                <div className="font-extrabold text-emerald-400 text-xl group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    {score.toFixed(2)}
                </div>
            </div>
        </div>
    )
}
