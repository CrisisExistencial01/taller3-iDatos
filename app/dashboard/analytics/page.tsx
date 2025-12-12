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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">World Happiness Analytics</h1>
            
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <h2 className="text-xl font-semibold text-slate-200 mb-4">Top Countries Analysis</h2>
                <DashboardChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">Average Score by Region</h2>
                    {loading ? (
                        <p className="text-slate-400">Loading...</p>
                    ) : (
                        <div className="space-y-3">
                            {regionalData.slice(0, 10).map((item) => (
                                <div key={item.region} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300">{item.region}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{ width: `${(item.avgScore / 10) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-slate-200 w-12 text-right">
                                            {item.avgScore.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">Happiness Trend Over Years</h2>
                    {loading ? (
                        <p className="text-slate-400">Loading...</p>
                    ) : yearlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={yearlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis 
                                    dataKey="year" 
                                    stroke="#64748b"
                                    fontSize={12}
                                />
                                <YAxis 
                                    stroke="#64748b"
                                    fontSize={12}
                                    domain={[0, 10]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="avgScore" 
                                    stroke="#10b981" 
                                    strokeWidth={2}
                                    name="Avg Happiness Score"
                                    dot={{ fill: '#10b981', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-slate-400">No data available</p>
                    )}
                </div>
            </div>
        </div>
    )
}
