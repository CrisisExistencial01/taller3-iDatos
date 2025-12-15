'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import { toPng } from 'html-to-image'

interface ExportOptions {
    filename?: string
    quality?: number
    format?: 'a4' | 'letter'
}

export function usePDFExport() {
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const exportToPDF = async (
        elementId: string,
        options: ExportOptions = {}
    ) => {
        const {
            filename = 'world-happiness-report.pdf',
            quality = 0.95,
            format = 'a4'
        } = options

        setIsExporting(true)
        setError(null)

        try {
            const element = document.getElementById(elementId)
            if (!element) {
                throw new Error(`Element with id "${elementId}" not found`)
            }

            const dataUrl = await toPng(element, {
                backgroundColor: '#0a0e1a',
                quality: quality,
                pixelRatio: 2,
                cacheBust: true,
                fontEmbedCSS: '',
            })

            const elementWidth = element.scrollWidth
            const elementHeight = element.scrollHeight

            const pdfWidth = format === 'a4' ? 210 : 216 // mm
            const pdfHeight = (elementHeight * pdfWidth) / elementWidth

            // Create PDF
            const pdf = new jsPDF({
                orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
                unit: 'mm',
                format: format,
            })

            // Add image to PDF
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)

            // Add metadata
            pdf.setProperties({
                title: 'World Happiness Report',
                subject: 'Global Happiness Metrics and Insights',
                author: 'World Happiness Dashboard',
                keywords: 'happiness, analytics, world, statistics',
                creator: 'World Happiness Dashboard'
            })

            // Save the PDF
            pdf.save(filename)

            setIsExporting(false)
            return true
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to export PDF'
            setError(errorMessage)
            setIsExporting(false)
            console.error('PDF Export Error:', err)
            return false
        }
    }

    return {
        exportToPDF,
        isExporting,
        error,
    }
}
