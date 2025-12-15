export default function AboutPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-2 pb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    About the Project
                </h1>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    An interactive view of global happiness through data (2015–2024).
                    <br />
                    Submitted as partial fulfillment of the course Ingeniería de Datos - Universidad de La Frontera
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 glass card-hover rounded-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-2xl font-bold text-slate-100">Introduction</h2>
                        <p className="text-slate-300 leading-relaxed">
                            This project is based on the <strong>World Happiness 2015–2024</strong> dataset, a collection of global well-being metrics derived from the <em>World Happiness Report</em>.
                            The main objective is to build an <strong>interactive executive summary</strong> that allows users to analyze how perceptions of quality of life have evolved worldwide.
                        </p>
                    </div>
                </div>

                <div className="p-6 glass card-hover rounded-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            📊 Key Variables
                        </h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span> GDP per capita (Economy)
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span> Social support
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span> Healthy life expectancy
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span> Freedom to make life choices
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-6 glass card-hover rounded-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            🧰 Tech Stack
                        </h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="text-purple-400">⚡</span> Next.js (React)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-purple-400">🗄️</span> Supabase (PostgreSQL)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-purple-400">🚀</span> Vercel
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-purple-400">📈</span> Power BI
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
