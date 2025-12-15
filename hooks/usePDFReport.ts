import { useState } from 'react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

interface ReportSection {
    title: string;
    content: string;
}

interface PDFReportOptions {
    title: string;
    subtitle?: string;
    sections: ReportSection[];
    elementIdToCapture?: string; // ID of the HTML element to capture as image (e.g., charts)
}

export const usePDFReport = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async ({ title, subtitle, sections, elementIdToCapture }: PDFReportOptions) => {
        try {
            setIsGenerating(true);
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            let yPos = 20;

            // 1. Portada / Encabezado
            doc.setFontSize(24);
            doc.setTextColor(41, 128, 185); // Blue color
            doc.text(title, margin, yPos);
            yPos += 10;

            if (subtitle) {
                doc.setFontSize(14);
                doc.setTextColor(100);
                doc.text(subtitle, margin, yPos);
                yPos += 20;
            }

            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 15;

            // 2. Secciones de Texto (Descripción, Preguntas, Ética, Conclusiones)
            doc.setTextColor(0);
            sections.forEach((section) => {
                // Check for page break
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(section.title, margin, yPos);
                yPos += 10;

                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');

                const splitText = doc.splitTextToSize(section.content, pageWidth - 2 * margin);
                doc.text(splitText, margin, yPos);
                yPos += (splitText.length * 7) + 10;
            });

            // 3. Gráficos (Captura de elemento HTML)
            if (elementIdToCapture) {
                const element = document.getElementById(elementIdToCapture);
                if (element) {
                    if (yPos > 200) {
                        doc.addPage();
                        yPos = 20;
                    }

                    doc.setFontSize(16);
                    doc.setFont('helvetica', 'bold');
                    doc.text("Gráficos Relevantes", margin, yPos);
                    yPos += 10;

                    try {
                        // Small delay to ensure rendering stability
                        await new Promise(resolve => setTimeout(resolve, 500));

                        const dataUrl = await toPng(element, {
                            quality: 0.95,
                            backgroundColor: '#ffffff',
                            cacheBust: true,
                            pixelRatio: 2,
                            fontEmbedCSS: '' // Prevent font parsing errors
                        });
                        const imgProps = doc.getImageProperties(dataUrl);
                        const pdfWidth = pageWidth - 2 * margin;
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                        doc.addImage(dataUrl, 'PNG', margin, yPos, pdfWidth, pdfHeight);
                    } catch (error) {
                        console.error("Error capturing element:", error);
                        doc.setFontSize(10);
                        doc.setTextColor(255, 0, 0);
                        doc.text(`Error al generar la imagen de los gráficos. Detalles en consola.`, margin, yPos);
                    }
                }
            }

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            }

            doc.save('reporte_felicidad_mundial.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return { generatePDF, isGenerating };
};
