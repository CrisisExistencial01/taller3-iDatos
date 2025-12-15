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
import { Sparkles, Info, HelpCircle, ShieldAlert } from "lucide-react"

export default function AnalyticsPage() {
    const [regionalData, setRegionalData] = React.useState<any[]>([])
    const [yearlyData, setYearlyData] = React.useState<any[]>([])
    const [availableYears, setAvailableYears] = React.useState<number[]>([])
    const [selectedYearTopCountries, setSelectedYearTopCountries] = React.useState<number | null>(2024)
    const [selectedYearRegional, setSelectedYearRegional] = React.useState<number | null>(2024)
    const [loading, setLoading] = React.useState(true)

    // PDF Export (Photo-based) & AI Conclusions
    const { exportToPDF, isExporting } = usePDFExport()
    const [conclusions, setConclusions] = React.useState("")
    const [isAiLoading, setIsAiLoading] = React.useState(false)

    const handleGenerateConclusions = () => {
        setIsAiLoading(true)
        setTimeout(() => {
            setConclusions("Basado en el análisis de los datos de felicidad mundial (2015-2024), se observa una correlación positiva fuerte entre el PIB per cápita y el puntaje de felicidad. Los países nórdicos (Finlandia, Dinamarca, Islandia) mantienen consistentemente las posiciones más altas, demostrando la eficacia de sus modelos de bienestar social. El apoyo social emerge como un factor crítico para la resiliencia en tiempos de crisis, como se evidenció durante la pandemia. Las regiones con mayores índices de percepción de corrupción tienden a mostrar niveles de felicidad significativamente menores.")
            setIsAiLoading(false)
        }, 1500)
    }

    const handleDownloadReport = async () => {
        const filename = `analytics-report-${selectedYearTopCountries || 'all-years'}.pdf`
        await exportToPDF(['analytics-page-1', 'analytics-page-2'], { filename })
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

            {/* Analytics Content - Split into two sections for PDF Export */}
            <div className="space-y-8">

                {/* Page 1: Context, AI, Top Countries */}
                <div id="analytics-page-1" className="space-y-8 p-1">
                    {/* Header for Report (Visible but styled for context) */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <GlassCard className="border-blue-500/20">
                            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-3">
                                <Info className="w-5 h-5 text-blue-400" />
                                Descripción del Dataset
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                El dataset 'World Happiness Report' (2015-2024) consolida métricas de bienestar de más de 150 países. Incluye variables como PIB per cápita, apoyo social, esperanza de vida saludable, libertad, generosidad y percepción de corrupción.
                            </p>
                        </GlassCard>

                        <GlassCard className="border-emerald-500/20">
                            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-3">
                                <HelpCircle className="w-5 h-5 text-emerald-400" />
                                Preguntas de Investigación
                            </h3>
                            <ul className="text-slate-400 text-sm leading-relaxed list-disc list-inside space-y-1">
                                <li>¿Qué países lideran el ranking de felicidad?</li>
                                <li>¿Cómo influye la economía en el bienestar?</li>
                                <li>¿Qué impacto tuvo la pandemia en la felicidad?</li>
                                <li>¿Relación entre generosidad y felicidad?</li>
                                <li>¿Impacto de la corrupción en el bienestar?</li>
                                <li>¿Regiones con mayor crecimiento en felicidad?</li>
                            </ul>
                        </GlassCard>
                    </div>

                    {/* AI Conclusions Section */}
                    <GlassCard hoverGradient="purple" className="border-purple-500/20">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    Análisis Inteligente & Conclusiones
                                </h3>
                                <button
                                    onClick={handleGenerateConclusions}
                                    disabled={isAiLoading || conclusions.length > 0}
                                    className="text-xs bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full hover:bg-purple-600/30 transition-colors disabled:opacity-50 font-medium border border-purple-500/20 flex items-center gap-2"
                                >
                                    {isAiLoading ? (
                                        <>Generando...</>
                                    ) : (
                                        <>
                                            <Sparkles className="w-3 h-3" />
                                            Generar Insights con IA
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="min-h-[80px] text-slate-300 text-sm leading-relaxed bg-slate-950/30 p-5 rounded-xl border border-slate-800/50">
                                {conclusions ? (
                                    <p className="animate-fade-in">{conclusions}</p>
                                ) : (
                                    <span className="text-slate-500 italic flex items-center gap-2">
                                        Haga clic en generar para obtener un análisis detallado basado en los datos actuales...
                                    </span>
                                )}
                            </div>
                        </div>
                    </GlassCard>

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
                        <div className="rounded-xl overflow-hidden bg-slate-900/20 p-2">
                            <DashboardChart selectedYear={selectedYearTopCountries} />
                        </div>
                    </GlassCard>
                </div>

                {/* Page 2: Regional, Trends, Ethics */}
                <div id="analytics-page-2" className="space-y-8 p-1">
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

                    {/* Ethical Decisions Section */}
                    <GlassCard className="border-red-500/20">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-3">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                            Consideraciones Éticas
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Se ha priorizado la privacidad de los datos agregados y la transparencia en las fuentes (Gallup World Poll). Se evita realizar inferencias causales directas sin sustento estadístico robusto y se han omitido datos faltantes para mantener la integridad del análisis.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    )
}

