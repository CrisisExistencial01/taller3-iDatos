import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white selection:bg-blue-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <main className="relative z-10 flex flex-col items-center gap-10 px-4 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            World Happiness
          </span>
          <br />
          <span className="text-white drop-shadow-lg">Analytics Dashboard</span>
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
          Explore global happiness metrics with real-time data from Supabase and interactive Power BI reports.
          Discover insights about happiness scores, GDP, social support, and more across countries and regions.

        </p>

        <div className="flex flex-row items-center justify-center gap-4 mt-4 flex-wrap">
          <Link
            href="/dashboard"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-cyan-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="https://supabase.com"
            target="_blank"
            className="flex h-12 items-center justify-center rounded-xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm px-8 font-semibold text-emerald-300 transition-all duration-200 hover:from-emerald-600/30 hover:to-teal-600/30 hover:border-emerald-400 hover:text-emerald-200 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            Supabase
          </Link>

          <Link
            href="/dashboard/analytics"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-purple-500/50 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm px-8 font-semibold text-purple-300 transition-all duration-200 hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-400 hover:text-purple-200 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            Analytics
          </Link>
        </div>
        <p className="max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
          Submitted as partial fulfillment of the course <br />Ingeniería de Datos - Universidad de La Frontera
        </p>
        <p className="max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
          Author: Cristóbal Cheuquel
        </p>
      </main>
    </div>
  )
}

