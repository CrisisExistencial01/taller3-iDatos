import { PowerBIEmbed } from "@/components/PowerBIEmbed"

export default function ReportsPage() {
    const powerBIEmbedUrl = "https://app.powerbi.com/view?r=eyJrIjoiOWYwZDRkNjMtODVmZi00ODJkLTk0NmItYzcyOTYzNTkwOTZhIiwidCI6ImZjZDlhYmQ4LWRmY2QtNGExYS1iNzE5LThhMTNhY2ZkNWVkOSIsImMiOjR9";
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-2 pb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Power BI Reports
                </h1>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    Interactive reports and visualizations powered by Power BI. Explore comprehensive data insights and analytics.
                </p>
            </div>
            <PowerBIEmbed embedUrl={powerBIEmbedUrl} />
        </div>
    )
}

