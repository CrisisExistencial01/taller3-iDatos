import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Smart Analytics
          </span>
          <br />
          For Your Business.
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 sm:text-xl">
          Explore global happiness metrics with real-time data from Supabase and interactive Power BI reports.
          Discover insights about happiness scores, GDP, social support, and more across countries and regions.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="group flex h-12 items-center gap-2 rounded-full bg-blue-600 px-8 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="https://supabase.com"
            target="_blank"
            className="flex h-12 items-center rounded-full border border-slate-700 bg-slate-900/50 px-8 font-semibold text-slate-300 transition-colors hover:bg-slate-800"
          >
            Supabase
          </Link>
        </div>
      </main>
    </div>
  )
}
