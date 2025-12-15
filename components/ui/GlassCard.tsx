import React from 'react'

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    hoverGradient?: 'blue' | 'emerald' | 'purple' | 'cyan'
}

const gradientClasses = {
    blue: 'from-blue-600/0 via-cyan-600/0 to-transparent hover:opacity-100',
    emerald: 'from-emerald-600/0 via-cyan-600/0 to-transparent hover:opacity-100',
    purple: 'from-blue-600/0 via-purple-600/0 to-transparent hover:opacity-100',
    cyan: 'from-blue-600/0 via-cyan-600/0 to-emerald-600/0 hover:from-blue-600/5 hover:via-cyan-600/5 hover:to-emerald-600/5'
}

export function GlassCard({ children, className = '', hoverGradient = 'blue' }: GlassCardProps) {
    return (
        <div className={`rounded-2xl glass card-hover p-6 relative overflow-hidden ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 ${gradientClasses[hoverGradient]}`}></div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
