export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-2 pb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    Manage your dashboard preferences and configuration. Customize your experience to suit your needs.
                </p>
            </div>
            <div className="p-8 glass card-hover rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100 mb-2">General Settings</h2>
                        <p className="text-slate-400 text-sm">Configure your dashboard preferences and display options.</p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-800/60">
                        <div className="flex items-center justify-between p-5 rounded-xl border border-slate-800/60 bg-gradient-to-r from-slate-800/20 to-slate-900/20 hover:from-slate-800/40 hover:to-slate-900/40 hover:border-slate-700/60 transition-all duration-300 group">
                            <div>
                                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Dark Mode</p>
                                <p className="text-xs text-slate-500 mt-1">Toggle dark mode theme</p>
                            </div>
                            <div className="h-7 w-12 rounded-full bg-slate-700/60 border-2 border-slate-600/50 relative cursor-pointer group-hover:border-slate-500 transition-all duration-300">
                                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-slate-400 transition-all duration-300 group-hover:bg-slate-300"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-xl border border-slate-800/60 bg-gradient-to-r from-slate-800/20 to-slate-900/20 hover:from-slate-800/40 hover:to-slate-900/40 hover:border-slate-700/60 transition-all duration-300 group">
                            <div>
                                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Email Notifications</p>
                                <p className="text-xs text-slate-500 mt-1">Receive updates via email</p>
                            </div>
                            <div className="h-7 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-500/50 relative cursor-pointer group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/25">
                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

