'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@/utils/supabase/client'

interface HappinessData {
    country: string
    happiness_score: number
    year: number
    regional_indicator?: string
}

interface DashboardChartProps {
    selectedYear?: number | null
}

export function DashboardChart({ selectedYear }: DashboardChartProps = {}) {
    const [chartData, setChartData] = React.useState<HappinessData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient()
                let query = supabase
                    .from('world_happiness')
                    .select('country, happiness_score, year, regional_indicator')
                    .order('happiness_score', { ascending: false })

                // Apply year filter if provided
                if (selectedYear !== null && selectedYear !== undefined) {
                    query = query.eq('year', selectedYear)
                }

                const { data, error: fetchError } = await query.limit(20)

                if (fetchError) {
                    setError(fetchError.message)
                    setLoading(false)
                    return
                }

                if (data) {
                    setChartData(data)
                }
                setLoading(false)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data')
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedYear])

    if (loading) {
        return (
            <div className="h-[300px] w-full rounded-xl bg-slate-950/40 p-4 border border-slate-800/60 shadow-lg backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-10 w-10 border-4 border-slate-700/50 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 h-10 w-10 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Loading happiness data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-[300px] w-full rounded-xl bg-red-950/30 p-6 border-2 border-red-800/50 shadow-lg backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-400 font-semibold">Error loading data</p>
                    <p className="text-red-500/70 text-sm">{error}</p>
                </div>
            </div>
        )
    }

    // Prepare data for chart - show top countries by happiness score
    const chartDataFormatted = chartData
        .slice(0, 10)
        .map((item) => ({
            name: item.country.length > 10 ? item.country.substring(0, 10) + '...' : item.country,
            fullName: item.country,
            score: parseFloat(item.happiness_score.toString()),
        }))

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataFormatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorHappiness" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                            <stop offset="30%" stopColor="#14b8a6" stopOpacity={0.9} />
                            <stop offset="60%" stopColor="#06b6d4" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#94a3b8', fontWeight: 500 }}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 10]}
                        tick={{ fill: '#94a3b8', fontWeight: 500 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0a0e1a',
                            borderColor: '#1e293b',
                            color: '#f8fafc',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.5)',
                            padding: '14px 18px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}
                        itemStyle={{ color: '#f8fafc', padding: '6px 0', fontWeight: '500' }}
                        labelStyle={{ color: '#cbd5e1', marginBottom: '10px', fontWeight: '700', fontSize: '13px' }}
                        formatter={(value: number, name: string, props: any) => [
                            `${value.toFixed(2)}`,
                            props.payload.fullName,
                        ]}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.15)', stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Bar
                        dataKey="score"
                        fill="url(#colorHappiness)"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

