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
        elementIds: string | string[],
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
            const ids = Array.isArray(elementIds) ? elementIds : [elementIds]
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: format,
            })

            const pdfPageWidth = pdf.internal.pageSize.getWidth()
            const pdfPageHeight = pdf.internal.pageSize.getHeight()

            for (let i = 0; i < ids.length; i++) {
                const elementId = ids[i]
                const element = document.getElementById(elementId)
                if (!element) {
                    console.warn(`Element with id "${elementId}" not found`)
                    continue
                }

                if (i > 0) {
                    pdf.addPage()
                }

                // Add a small delay to ensure rendering stability
                await new Promise(resolve => setTimeout(resolve, 300));

                const dataUrl = await toPng(element, {
                    backgroundColor: '#0a0e1a', // Dark theme background
                    quality: quality,
                    pixelRatio: 2,
                    cacheBust: true,
                    fontEmbedCSS: '',
                })

                const elementWidth = element.scrollWidth
                const elementHeight = element.scrollHeight

                // Calculate scale to fit width (with some margin if desired, currently full width)
                const scale = pdfPageWidth / elementWidth
                const scaledHeight = elementHeight * scale

                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPageWidth, scaledHeight)
            }

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
