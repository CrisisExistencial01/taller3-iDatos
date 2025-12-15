'use client'

import React from 'react'
import { Calendar } from 'lucide-react'

interface YearSelectorProps {
    selectedYear: number | null
    years: number[]
    onYearChange: (year: number | null) => void
    loading?: boolean
}

export function YearSelector({ selectedYear, years, onYearChange, loading = false }: YearSelectorProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Year:</span>
            </div>
            <select
                value={selectedYear ?? '2024'}
                onChange={(e) => onYearChange(e.target.value === 'all' ? null : parseInt(e.target.value))}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm font-medium hover:bg-slate-800/80 hover:border-slate-600/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
                <option value="2024">2024</option>
                {years.filter(year => year !== 2024).map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    )
}
