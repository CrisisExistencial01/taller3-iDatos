'use client'

import { DashboardChart } from "@/components/DashboardChart"
import { YearSelector } from "@/components/YearSelector"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { DownloadReportButton } from "@/components/ui/DownloadReportButton"
import { createClient } from "@/utils/supabase/client"
import { usePDFExport } from "@/hooks/usePDFExport"
import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function AnalyticsPage() {
    const [regionalData, setRegionalData] = React.useState<any[]>([])
    const [yearlyData, setYearlyData] = React.useState<any[]>([])
    const [availableYears, setAvailableYears] = React.useState<number[]>([])
    const [selectedYearTopCountries, setSelectedYearTopCountries] = React.useState<number | null>(2024)
    const [selectedYearRegional, setSelectedYearRegional] = React.useState<number | null>(2024)
    const [loading, setLoading] = React.useState(true)

    // PDF Export
    const { exportToPDF, isExporting } = usePDFExport()

    const handleDownloadReport = async () => {
        const filename = `analytics-report-${selectedYearTopCountries || 'all-years'}.pdf`
        await exportToPDF('analytics-content', { filename })
    }

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const supabase = createClient()

                // Fetch all data
                const { data, error } = await supabase
                    .from('world_happiness')
                    .select('*')
                    .order('year', { ascending: true })

                if (error) {
                    console.error('Error:', error)
                    setLoading(false)
                    return
                }

                if (data) {
                    // Extract unique years
                    const years = Array.from(new Set(data.map(item => item.year)))
                        .filter(year => year !== null && year !== undefined)
                        .sort((a, b) => b - a) // Sort descending
                    setAvailableYears(years)

                    // Group by year for yearly trend
                    const yearlyMap = new Map<number, { count: number; totalScore: number }>()
                    data.forEach((item) => {
                        if (item.year) {
                            const existing = yearlyMap.get(item.year) || { count: 0, totalScore: 0 }
                            yearlyMap.set(item.year, {
                                count: existing.count + 1,
                                totalScore: existing.totalScore + parseFloat(item.happiness_score?.toString() || '0'),
                            })
                        }
                    })

                    const yearly = Array.from(yearlyMap.entries())
                        .map(([year, stats]) => ({
                            year: year.toString(),
                            avgScore: stats.totalScore / stats.count,
                            count: stats.count,
                        }))
                        .sort((a, b) => parseInt(a.year) - parseInt(b.year))

                    setYearlyData(yearly)
                }
                setLoading(false)
            } catch (err) {
                console.error('Error:', err)
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    // Fetch regional data based on selected year
    React.useEffect(() => {
        const fetchRegionalData = async () => {
            try {
                const supabase = createClient()
                let query = supabase
                    .from('world_happiness')
                    .select('*')

                if (selectedYearRegional !== null) {
                    query = query.eq('year', selectedYearRegional)
                }

                const { data, error } = await query

                if (error) {
                    console.error('Error:', error)
                    return
                }

                if (data) {
                    // Group by regional indicator
                    const regionalMap = new Map<string, { count: number; totalScore: number }>()
                    data.forEach((item) => {
                        if (item.regional_indicator) {
                            const existing = regionalMap.get(item.regional_indicator) || { count: 0, totalScore: 0 }
                            regionalMap.set(item.regional_indicator, {
                                count: existing.count + 1,
                                totalScore: existing.totalScore + parseFloat(item.happiness_score?.toString() || '0'),
                            })
                        }
                    })

                    const regional = Array.from(regionalMap.entries())
                        .map(([region, stats]) => ({
                            region,
                            avgScore: stats.totalScore / stats.count,
                            count: stats.count,
                        }))
                        .sort((a, b) => b.avgScore - a.avgScore)

                    setRegionalData(regional)
                }
            } catch (err) {
                console.error('Error:', err)
            }
        }

        fetchRegionalData()
    }, [selectedYearRegional])

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-2">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                        World Happiness Analytics
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                        Deep dive into regional trends and yearly patterns. Analyze happiness metrics across different dimensions.
                    </p>
                </div>
                <DownloadReportButton
                    onClick={handleDownloadReport}
                    isLoading={isExporting}
                    disabled={loading}
                />
            </div>

            {/* Analytics Content - Wrapped for PDF Export */}
            <div id="analytics-content" className="space-y-8">


                <GlassCard hoverGradient="blue">
                    <SectionHeader
                        title="Top Countries Analysis"
                        description="Comprehensive breakdown of leading nations"
                        selectedYear={selectedYearTopCountries}
                        availableYears={availableYears}
                        onYearChange={setSelectedYearTopCountries}
                        loading={loading}
                        showYearSelector
                    />
                    <DashboardChart selectedYear={selectedYearTopCountries} />
                </GlassCard>

                <div className="grid gap-6 md:grid-cols-2">
                    <GlassCard hoverGradient="emerald">
                        <SectionHeader
                            title="Average Score by Region"
                            description="Regional happiness distribution"
                            selectedYear={selectedYearRegional}
                            availableYears={availableYears}
                            onYearChange={setSelectedYearRegional}
                            loading={loading}
                            showYearSelector
                        />
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="h-12 shimmer rounded-lg" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {regionalData.slice(0, 10).map((item, index) => (
                                    <div
                                        key={item.region}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-800/60 bg-gradient-to-r from-slate-800/20 to-slate-900/20 hover:from-slate-800/40 hover:to-slate-900/40 hover:border-slate-700/60 transition-all duration-300 group animate-slide-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors flex-1">{item.region}</span>
                                        <div className="flex items-center gap-4 flex-1 max-w-xs">
                                            <div className="flex-1 h-3.5 bg-slate-800/60 rounded-full overflow-hidden shadow-inner border border-slate-700/30">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-500 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.6)] relative overflow-hidden"
                                                    style={{ width: `${(item.avgScore / 10) * 100}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: 'shimmer 2s infinite' }}></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-extrabold text-emerald-400 w-16 text-right group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">
                                                {item.avgScore.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    <GlassCard hoverGradient="purple">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-100 mb-1">Happiness Trend Over Years</h2>
                            <p className="text-xs text-slate-500">Historical happiness progression</p>
                        </div>
                        {loading ? (
                            <div className="h-[300px] shimmer rounded-lg" />
                        ) : yearlyData.length > 0 ? (
                            <div className="bg-slate-950/40 rounded-xl p-5 border border-slate-800/50">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={yearlyData}>
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                                        <XAxis
                                            dataKey="year"
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: '#94a3b8' }}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            domain={[0, 10]}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: '#94a3b8' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                borderColor: '#1e293b',
                                                color: '#f8fafc',
                                                borderRadius: '12px',
                                                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.5)',
                                                padding: '12px 16px',
                                                border: '1px solid rgba(59, 130, 246, 0.2)'
                                            }}
                                            cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5', opacity: 0.5 }}
                                        />
                                        <Legend
                                            wrapperStyle={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avgScore"
                                            stroke="url(#lineGradient)"
                                            strokeWidth={4}
                                            name="Avg Happiness Score"
                                            dot={{ fill: '#10b981', r: 6, strokeWidth: 2, stroke: '#0f172a' }}
                                            activeDot={{ r: 8, fill: '#10b981', stroke: '#0f172a', strokeWidth: 3 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center">
                                <p className="text-slate-400">No data available</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    )
}

