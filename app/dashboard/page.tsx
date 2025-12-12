'use client'

import React from "react"
import { Globe, TrendingUp, MapPin, Award } from "lucide-react"
import { DashboardChart } from "@/components/DashboardChart"
import { PowerBIEmbed } from "@/components/PowerBIEmbed"
import { createClient } from "@/utils/supabase/client"

interface DashboardStats {
    totalCountries: number
    avgHappinessScore: number
    totalRegions: number
    topScore: number
}

export default function DashboardPage() {
    const [stats, setStats] = React.useState<DashboardStats>({
        totalCountries: 0,
        avgHappinessScore: 0,
        totalRegions: 0,
        topScore: 0,
    })
    const [topCountries, setTopCountries] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const supabase = createClient()
                
                // Fetch all data
                const { data: allData, error } = await supabase
                    .from('world_happiness')
                    .select('country, happiness_score, regional_indicator')

                if (error) {
                    console.error('Error fetching data:', error)
                    setLoading(false)
                    return
                }

                if (allData && allData.length > 0) {
                    // Calculate stats
                    const uniqueCountries = new Set(allData.map(d => d.country)).size
                    const uniqueRegions = new Set(allData.filter(d => d.regional_indicator).map(d => d.regional_indicator)).size
                    const scores = allData.map(d => parseFloat(d.happiness_score?.toString() || '0'))
                    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
                    const maxScore = Math.max(...scores)

                    setStats({
                        totalCountries: uniqueCountries,
                        avgHappinessScore: avgScore,
                        totalRegions: uniqueRegions,
                        topScore: maxScore,
                    })

                    // Get top 5 countries
                    const top5 = allData
                        .sort((a, b) => parseFloat(b.happiness_score?.toString() || '0') - parseFloat(a.happiness_score?.toString() || '0'))
                        .slice(0, 5)
                        .map((item, idx) => ({
                            rank: idx + 1,
                            country: item.country,
                            score: parseFloat(item.happiness_score?.toString() || '0'),
                            region: item.regional_indicator || 'N/A',
                        }))

                    setTopCountries(top5)
                }
                setLoading(false)
            } catch (err) {
                console.error('Error:', err)
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">World Happiness Dashboard</h1>
                    <p className="text-slate-400 mt-1">Global happiness metrics and insights from around the world.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card 
                    title="Total Countries" 
                    value={loading ? "..." : stats.totalCountries.toString()} 
                    change="" 
                    icon={Globe} 
                />
                <Card 
                    title="Avg Happiness Score" 
                    value={loading ? "..." : stats.avgHappinessScore.toFixed(2)} 
                    change="" 
                    icon={TrendingUp} 
                />
                <Card 
                    title="Regions Tracked" 
                    value={loading ? "..." : stats.totalRegions.toString()} 
                    change="" 
                    icon={MapPin} 
                />
                <Card 
                    title="Highest Score" 
                    value={loading ? "..." : stats.topScore.toFixed(2)} 
                    change="" 
                    icon={Award} 
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                {/* Chart Section */}
                <div className="col-span-1 lg:col-span-4 rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-200">Top Countries by Happiness Score</h3>
                    </div>
                    <DashboardChart />
                </div>

                {/* Top Countries List */}
                <div className="col-span-1 lg:col-span-3 rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-200 mb-4">Top 5 Happiest Countries</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-slate-400">Loading...</p>
                        ) : topCountries.length > 0 ? (
                            topCountries.map((item) => (
                                <div key={item.rank} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                            {item.rank}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{item.country}</p>
                                            <p className="text-xs text-slate-500">{item.region}</p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-emerald-400">{item.score.toFixed(2)}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Power BI Section */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
                <PowerBIEmbed embedUrl="https://app.powerbi.com/view?r=eyJrIjoiMmE4ZGEwZGMtOWY0MS00NzY1LTg5YjAtNGRhZmRjY2ExZTI2IiwidCI6IjQ0ODdiNTJmLWYxMTgtNDg5Mi05YjMzLTY1NTQ1YzQ4NzE4NiIsImMiOjR9" />
            </div>
        </div>
    )
}

interface CardProps {
    title: string
    value: string
    change: string
    icon: React.ElementType
}

function Card({ title, value, change, icon: Icon }: CardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all hover:bg-slate-900/80">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-slate-400">{title}</h3>
                <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-100">{value}</div>
                {change && (
                    <p className="text-xs text-slate-500 mt-1">
                        <span className="text-emerald-500 font-medium">{change}</span>
                    </p>
                )}
            </div>
        </div>
    )
}
