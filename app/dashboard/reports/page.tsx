'use client'

import { PowerBIEmbed } from "@/components/PowerBIEmbed"
import { DownloadReportButton } from "@/components/ui/DownloadReportButton"

export default function ReportsPage() {
    const powerBIEmbedUrl = "https://app.powerbi.com/view?r=eyJrIjoiOWYwZDRkNjMtODVmZi00ODJkLTk0NmItYzcyOTYzNTkwOTZhIiwidCI6ImZjZDlhYmQ4LWRmY2QtNGExYS1iNzE5LThhMTNhY2ZkNWVkOSIsImMiOjR9";

    const handleDownloadReport = () => {
        window.print()
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-2 print-hidden">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                        Power BI Reports
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                        Interactive reports and visualizations powered by Power BI. Explore comprehensive data insights and analytics.
                    </p>
                </div>
                <DownloadReportButton
                    onClick={handleDownloadReport}
                />
            </div>

            <div id="reports-content">
                <PowerBIEmbed embedUrl={powerBIEmbedUrl} />
            </div>
        </div>
    )
}


