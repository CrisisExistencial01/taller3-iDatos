import React from 'react'

interface PowerBIEmbedProps {
    embedUrl?: string
    placeholderImage?: string
}

export function PowerBIEmbed({ embedUrl, placeholderImage = "/images/report-placeholder.png" }: PowerBIEmbedProps) {
    return (
        <div className="flex h-[600px] md:h-[700px] w-full flex-col overflow-hidden rounded-2xl glass-strong shadow-2xl print:shadow-none print:rounded-none">
            {/* Header: Ocultar al imprimir para limpiar el PDF */}
            <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-slate-900/70 p-5 px-6 backdrop-blur-sm relative overflow-hidden print:hidden">
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

            <div className="relative flex-1 bg-slate-950 print:bg-white">
                {embedUrl ? (
                    <>
                        <iframe
                            title="Power BI Report"
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            frameBorder="0"
                            allowFullScreen={true}
                            className="absolute inset-0 h-full w-full transition-opacity duration-300 print:hidden"
                            loading="lazy"
                        />

                        <img
                            src={placeholderImage}
                            alt="Static Report Capture"
                            className="hidden print:block w-full h-auto object-contain"
                        />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center print:hidden">
                        <div className="text-center space-y-2">
                            <p className="text-slate-400 font-medium">No report URL provided</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
