import { PowerBIEmbed } from "@/components/PowerBIEmbed"

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Power BI Reports</h1>
            <PowerBIEmbed embedUrl="https://app.powerbi.com/view?r=eyJrIjoiMmE4ZGEwZGMtOWY0MS00NzY1LTg5YjAtNGRhZmRjY2ExZTI2IiwidCI6IjQ0ODdiNTJmLWYxMTgtNDg5Mi05YjMzLTY1NTQ1YzQ4NzE4NiIsImMiOjR9" />
        </div>
    )
}
