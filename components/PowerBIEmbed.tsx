import React from 'react'

interface PowerBIEmbedProps {
    embedUrl?: string
}

export function PowerBIEmbed({ embedUrl }: PowerBIEmbedProps) {
    return (
        <div className="flex h-[500px] w-full flex-col overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="border-b border-slate-800 bg-slate-900/50 p-4 px-6">
                <h3 className="text-lg font-semibold text-slate-200">Power BI Report</h3>
            </div>
            <div className="relative flex-1 bg-slate-950">
                {embedUrl ? (
                    <iframe
                        title="Power BI Report"
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        frameBorder="0"
                        allowFullScreen={true}
                        className="absolute inset-0 h-full w-full"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        <p>No report URL provided</p>
                    </div>
                )}
            </div>
        </div>
    )
}
