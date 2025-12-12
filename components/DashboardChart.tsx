'use client'

import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { createClient } from '@/utils/supabase/client'

interface HappinessData {
    country: string
    happiness_score: number
    year: number
    regional_indicator?: string
}

export function DashboardChart() {
    const [chartData, setChartData] = React.useState<HappinessData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient()
                const { data, error: fetchError } = await supabase
                    .from('world_happiness')
                    .select('country, happiness_score, year, regional_indicator')
                    .order('happiness_score', { ascending: false })
                    .limit(20)

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
    }, [])

    if (loading) {
        return (
            <div className="h-[300px] w-full rounded-xl bg-slate-900/50 p-4 border border-slate-800 shadow-sm backdrop-blur-sm flex items-center justify-center">
                <p className="text-slate-400">Loading happiness data...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-[300px] w-full rounded-xl bg-slate-900/50 p-4 border border-slate-800 shadow-sm backdrop-blur-sm flex items-center justify-center">
                <p className="text-red-400">Error: {error}</p>
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
        <div className="h-[300px] w-full rounded-xl bg-slate-900/50 p-4 border border-slate-800 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-200">Top Countries by Happiness Score</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataFormatted}>
                    <defs>
                        <linearGradient id="colorHappiness" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 10]}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number, name: string, props: any) => [
                            `${value.toFixed(2)}`,
                            props.payload.fullName,
                        ]}
                    />
                    <Bar
                        dataKey="score"
                        fill="url(#colorHappiness)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
