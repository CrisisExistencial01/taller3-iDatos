'use client'

import { DashboardChart } from "@/components/DashboardChart"
import { createClient } from "@/utils/supabase/client"
import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function AnalyticsPage() {
    const [regionalData, setRegionalData] = React.useState<any[]>([])
    const [yearlyData, setYearlyData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

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

                    // Group by year
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

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-2 pb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    World Happiness Analytics
                </h1>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    Deep dive into regional trends and yearly patterns. Analyze happiness metrics across different dimensions.
                </p>
            </div>
            
            <div className="p-6 glass card-hover rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-cyan-600/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-100 mb-1">Top Countries Analysis</h2>
                        <p className="text-xs text-slate-500">Comprehensive breakdown of leading nations</p>
                    </div>
                    <DashboardChart />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 glass card-hover rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-cyan-600/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-100 mb-1">Average Score by Region</h2>
                            <p className="text-xs text-slate-500">Regional happiness distribution</p>
                        </div>
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
                    </div>
                </div>

                <div className="p-6 glass card-hover rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
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
                    </div>
                </div>
            </div>
        </div>
    )
}
