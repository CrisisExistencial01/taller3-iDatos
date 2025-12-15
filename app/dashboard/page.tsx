'use client'

import React from "react"
import { Globe, TrendingUp, MapPin, Award } from "lucide-react"
import { DashboardChart } from "@/components/DashboardChart"
import { YearSelector } from "@/components/YearSelector"
import { PowerBIEmbed } from "@/components/PowerBIEmbed"
import { createClient } from "@/utils/supabase/client"
import clsx from "clsx"

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
    const [availableYears, setAvailableYears] = React.useState<number[]>([])
    const [selectedYear, setSelectedYear] = React.useState<number | null>(null)
    const [selectedYearTop5, setSelectedYearTop5] = React.useState<number | null>(2024)
    const [loading, setLoading] = React.useState(true)
    const powerbiEmbedUrl = "https://app.powerbi.com/view?r=eyJrIjoiOWYwZDRkNjMtODVmZi00ODJkLTk0NmItYzcyOTYzNTkwOTZhIiwidCI6ImZjZDlhYmQ4LWRmY2QtNGExYS1iNzE5LThhMTNhY2ZkNWVkOSIsImMiOjR9";

    const top5CountriesByYear = (allData: any[], year: number | null) => {
        if (!year) return []
        return allData.filter(country => country.year === year)
            .sort((a, b) => parseFloat(b.happiness_score?.toString() || '0') - parseFloat(a.happiness_score?.toString() || '0'))
            .slice(0, 5)
            .map((item, idx) => ({
                rank: idx + 1,
                country: item.country,
                score: parseFloat(item.happiness_score?.toString() || '0'),
                region: item.regional_indicator || 'N/A',
            }))
    }

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const supabase = createClient()

                // Fetch all data
                const { data: allData, error } = await supabase
                    .from('world_happiness')
                    .select('country, happiness_score, regional_indicator, year')

                if (error) {
                    console.error('Error fetching data:', error)
                    setLoading(false)
                    return
                }

                if (allData && allData.length > 0) {
                    // Extract unique years
                    const years = Array.from(new Set(allData.map(d => d.year)))
                        .filter(year => year !== null && year !== undefined)
                        .sort((a, b) => b - a) // Sort descending
                    setAvailableYears(years)

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

                    // Get top 5 countries for initial year
                    const top5 = top5CountriesByYear(allData, selectedYearTop5)
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

    // Update top 5 countries when selected year changes
    React.useEffect(() => {
        const fetchTop5 = async () => {
            try {
                const supabase = createClient()
                const { data: allData, error } = await supabase
                    .from('world_happiness')
                    .select('country, happiness_score, regional_indicator, year')

                if (error) {
                    console.error('Error fetching data:', error)
                    return
                }

                if (allData && allData.length > 0) {
                    const top5 = top5CountriesByYear(allData, selectedYearTop5)
                    setTopCountries(top5)
                }
            } catch (err) {
                console.error('Error:', err)
            }
        }

        if (selectedYearTop5) {
            fetchTop5()
        }
    }, [selectedYearTop5])

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-2">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                        World Happiness Dashboard
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                        Global happiness metrics and insights from around the world. Explore real-time data and discover patterns across countries and regions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary inline-flex items-center justify-center rounded-xl text-sm font-semibold h-11 px-6 gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
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
                    loading={loading}
                />
                <Card
                    title="Avg Happiness Score"
                    value={loading ? "..." : stats.avgHappinessScore.toFixed(2)}
                    change=""
                    icon={TrendingUp}
                    loading={loading}
                />
                <Card
                    title="Regions Tracked"
                    value={loading ? "..." : stats.totalRegions.toString()}
                    change=""
                    icon={MapPin}
                    loading={loading}
                />
                <Card
                    title="Highest Score"
                    value={loading ? "..." : stats.topScore.toFixed(2)}
                    change=""
                    icon={Award}
                    loading={loading}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                {/* Chart Section */}
                <div className="col-span-1 lg:col-span-4 rounded-2xl glass card-hover p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-cyan-600/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="font-bold text-slate-100 text-xl mb-1">Top Countries by Happiness Score</h3>
                                <p className="text-xs text-slate-500">Ranked by overall happiness metrics</p>
                            </div>
                            <YearSelector
                                selectedYear={selectedYear}
                                years={availableYears}
                                onYearChange={setSelectedYear}
                                loading={loading}
                            />
                        </div>
                        <DashboardChart selectedYear={selectedYear} />
                    </div>
                </div>

                {/* Top Countries List */}
                <div className="col-span-1 lg:col-span-3 rounded-2xl glass card-hover p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-cyan-600/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="font-bold text-slate-100 text-xl mb-1">Top 5 Happiest Countries</h3>
                                <p className="text-xs text-slate-500">Leading nations in global happiness</p>
                            </div>
                            <YearSelector
                                selectedYear={selectedYearTop5}
                                years={availableYears}
                                onYearChange={setSelectedYearTop5}
                                loading={loading}
                            />
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-16 shimmer rounded-lg" />
                                    ))}
                                </div>
                            ) : topCountries.length > 0 ? (
                                topCountries.map((item, index) => (
                                    <div
                                        key={item.rank}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-800/60 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-slate-700/60 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden animate-slide-in-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-emerald-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={clsx(
                                                "h-12 w-12 rounded-xl flex items-center justify-center font-extrabold text-base transition-all duration-300 group-hover:scale-110 shadow-lg",
                                                item.rank === 1
                                                    ? "bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 text-yellow-300 border-2 border-yellow-500/40 glow-blue"
                                                    : item.rank === 2
                                                        ? "bg-gradient-to-br from-slate-400/30 to-slate-500/30 text-slate-200 border-2 border-slate-500/40"
                                                        : item.rank === 3
                                                            ? "bg-gradient-to-br from-amber-600/30 to-amber-700/30 text-amber-300 border-2 border-amber-600/40"
                                                            : "bg-slate-800/60 text-slate-400 border-2 border-slate-700/60"
                                            )}>
                                                {item.rank}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">{item.country}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.region}</p>
                                            </div>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="font-extrabold text-emerald-400 text-xl group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                                                {item.score.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-center py-8">No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Power BI Section */}
            <div className="rounded-2xl glass card-hover overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-cyan-600/0 to-emerald-600/0 hover:from-blue-600/5 hover:via-cyan-600/5 hover:to-emerald-600/5 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <PowerBIEmbed embedUrl={powerbiEmbedUrl} />
                </div>
            </div>
        </div>
    )
}

interface CardProps {
    title: string
    value: string
    change: string
    icon: React.ElementType
    loading?: boolean
}

function Card({ title, value, change, icon: Icon, loading = false }: CardProps) {
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

