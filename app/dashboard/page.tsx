'use client'

import React from "react"
import { Globe, TrendingUp, MapPin, Award } from "lucide-react"
import { DashboardChart } from "@/components/DashboardChart"
import { YearSelector } from "@/components/YearSelector"
import { PowerBIEmbed } from "@/components/PowerBIEmbed"
import { StatsCard } from "@/components/ui/StatsCard"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { CountryRankItem } from "@/components/ui/CountryRankItem"
import { GlassCard } from "@/components/ui/GlassCard"
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
    const [availableYears, setAvailableYears] = React.useState<number[]>([])
    const [selectedYear, setSelectedYear] = React.useState<number | null>(2024)
    const [selectedYearTop5, setSelectedYearTop5] = React.useState<number | null>(2024)
    const [selectedYearStats, setSelectedYearStats] = React.useState<number | null>(2024)
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

                    // Filter data by selected year for stats
                    const yearData = selectedYearStats
                        ? allData.filter(d => d.year === selectedYearStats)
                        : allData

                    // Calculate stats for the selected year
                    const uniqueCountries = new Set(yearData.map(d => d.country)).size
                    const uniqueRegions = new Set(yearData.filter(d => d.regional_indicator).map(d => d.regional_indicator)).size
                    const scores = yearData.map(d => parseFloat(d.happiness_score?.toString() || '0'))
                    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
                    const maxScore = scores.length > 0 ? Math.max(...scores) : 0

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
    }, [selectedYearStats, selectedYearTop5])


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
                    <YearSelector
                        selectedYear={selectedYearStats}
                        years={availableYears}
                        onYearChange={setSelectedYearStats}
                        loading={loading}
                    />
                </div>
            </div>


            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Countries"
                    value={loading ? "..." : stats.totalCountries.toString()}
                    icon={Globe}
                    loading={loading}
                />
                <StatsCard
                    title="Avg Happiness Score"
                    value={loading ? "..." : stats.avgHappinessScore.toFixed(2)}
                    icon={TrendingUp}
                    loading={loading}
                />
                <StatsCard
                    title="Regions Tracked"
                    value={loading ? "..." : stats.totalRegions.toString()}
                    icon={MapPin}
                    loading={loading}
                />
                <StatsCard
                    title="Highest Score"
                    value={loading ? "..." : stats.topScore.toFixed(2)}
                    icon={Award}
                    loading={loading}
                />
            </div>


            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                {/* Chart Section */}
                <GlassCard className="col-span-1 lg:col-span-4" hoverGradient="blue">
                    <SectionHeader
                        title="Top Countries by Happiness Score"
                        description="Ranked by overall happiness metrics"
                        selectedYear={selectedYear}
                        availableYears={availableYears}
                        onYearChange={setSelectedYear}
                        loading={loading}
                        showYearSelector
                    />
                    <DashboardChart selectedYear={selectedYear} />
                </GlassCard>

                {/* Top Countries List */}
                <GlassCard className="col-span-1 lg:col-span-3" hoverGradient="emerald">
                    <SectionHeader
                        title="Top 5 Happiest Countries"
                        description="Leading nations in global happiness"
                        selectedYear={selectedYearTop5}
                        availableYears={availableYears}
                        onYearChange={setSelectedYearTop5}
                        loading={loading}
                        showYearSelector
                    />
                    <div className="space-y-3">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 shimmer rounded-lg" />
                                ))}
                            </div>
                        ) : topCountries.length > 0 ? (
                            topCountries.map((item, index) => (
                                <CountryRankItem
                                    key={item.rank}
                                    rank={item.rank}
                                    country={item.country}
                                    region={item.region}
                                    score={item.score}
                                    index={index}
                                />
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-8">No data available</p>
                        )}
                    </div>
                </GlassCard>
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
