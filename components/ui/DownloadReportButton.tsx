import React from 'react'
import { Download, Loader2 } from 'lucide-react'

interface DownloadReportButtonProps {
    onClick: () => void
    isLoading?: boolean
    disabled?: boolean
    className?: string
}

export function DownloadReportButton({
    onClick,
    isLoading = false,
    disabled = false,
    className = ''
}: DownloadReportButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`btn-primary inline-flex items-center justify-center rounded-xl text-sm font-semibold h-11 px-6 gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${className}`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    Download Report
                </>
            )}
        </button>
    )
}
