import React from 'react'

interface PowerBIEmbedProps {
    embedUrl?: string
}

export function PowerBIEmbed({ embedUrl }: PowerBIEmbedProps) {
    return (
        <div className="flex h-[600px] md:h-[700px] w-full flex-col overflow-hidden rounded-2xl glass-strong shadow-2xl">
            <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-slate-900/70 p-5 px-6 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-emerald-600/5"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-100 mb-0.5">Power BI Report</h3>
                        <p className="text-xs text-slate-500">Interactive data visualization</p>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        <span className="text-xs font-semibold text-emerald-400">Live</span>
                    </div>
                </div>
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
                        className="absolute inset-0 h-full w-full transition-opacity duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center space-y-2">
                            <div className="h-12 w-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                                <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-slate-400 font-medium">No report URL provided</p>
                            <p className="text-slate-500 text-sm">Please configure a Power BI embed URL</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

