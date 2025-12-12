import { PowerBIEmbed } from "@/components/PowerBIEmbed"

export default function ReportsPage() {
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
            <PowerBIEmbed embedUrl="https://app.powerbi.com/view?r=eyJrIjoiMmE4ZGEwZGMtOWY0MS00NzY1LTg5YjAtNGRhZmRjY2ExZTI2IiwidCI6IjQ0ODdiNTJmLWYxMTgtNDg5Mi05YjMzLTY1NTQ1YzQ4NzE4NiIsImMiOjR9" />
        </div>
    )
}

