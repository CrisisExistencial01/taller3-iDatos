import React from 'react'
import { YearSelector } from '@/components/YearSelector'

interface SectionHeaderProps {
    title: string
    description: string
    selectedYear?: number | null
    availableYears?: number[]
    onYearChange?: (year: number | null) => void
    loading?: boolean
    showYearSelector?: boolean
}

export function SectionHeader({
    title,
    description,
    selectedYear,
    availableYears = [],
    onYearChange,
    loading = false,
    showYearSelector = false
}: SectionHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
                <h3 className="font-bold text-slate-100 text-xl mb-1">{title}</h3>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            {showYearSelector && onYearChange && (
                <YearSelector
                    selectedYear={selectedYear ?? null}
                    years={availableYears}
                    onYearChange={onYearChange}
                    loading={loading}
                />
            )}
        </div>
    )
}
