import type { LucideIcon } from 'lucide-react';

interface CompetitionCardProps {
    title: string;
    desc: string;
    icon: LucideIcon;
}

export function ComCard({ title, desc, icon: Icon }: CompetitionCardProps) {
    return (
        <div className="carousel-card relative flex min-h-105 flex-col justify-between overflow-hidden rounded-3xl border border-gray-800/80 bg-slate-950/70 p-8 backdrop-blur-md transition-[box-shadow,border-color] duration-300">
            <div className="flex justify-center py-6">
                <div className="relative rounded-2xl border border-gray-800 bg-slate-900 p-6">
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[8px_8px]" />
                    <Icon className="relative z-10 h-16 w-16 text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                </div>
            </div>

            <div className="mt-4 flex grow flex-col justify-end text-center">
                <h3 className="text-xl font-bold tracking-wide text-white">
                    {title}
                </h3>

                <p className="mt-3 line-clamp-4 text-xs leading-relaxed font-light text-gray-400">
                    {desc}
                </p>
            </div>
        </div>
    );
}
