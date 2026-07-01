import { Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CompetitionStatusBadge from '@/features/participant/competitions/components/competition-status-badge';
import { CompetitionStatusMap } from '@/types';
import type { ICompetitionCard } from '@/types';

type CompetitionCardProps = ICompetitionCard & {
    icon?: LucideIcon;
    isActive: boolean;
    color?: string;
};

export function CompetitionCard({
    name,
    description,
    status,
    icon: CompetitionIcon = Rocket,
    color = 'from-purple-500 to-pink-500',
    isActive,
}: CompetitionCardProps) {
    const isOpen = status === CompetitionStatusMap.Open.value;

    return (
        <div
            className={`relative flex w-full flex-col items-center rounded-2xl border bg-slate-950/85 p-6 text-center backdrop-blur-xl transition-all duration-500 ${
                isActive && isOpen
                    ? 'border-purple-500/40 bg-linear-to-b from-slate-950 via-slate-950 to-purple-950/20 shadow-[0_25px_60px_rgba(168,85,247,0.2)]'
                    : isActive && !isOpen
                      ? 'border-zinc-900/60 bg-linear-to-b from-slate-950 via-slate-950 to-zinc-900/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
                      : 'border-zinc-900/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
            }`}
            style={{
                animation: isActive ? 'float 4s ease-in-out infinite' : 'none',
            }}
        >
            {isActive && (
                <div
                    className={`absolute top-0 right-1/4 left-1/4 h-0.5 bg-linear-to-r from-transparent to-transparent shadow-[0_0_15px] ${
                        isOpen
                            ? 'via-purple-400 shadow-purple-500'
                            : 'via-zinc-400 shadow-black/60'
                    }`}
                />
            )}

            <div className="relative mt-2 mb-6 flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-slate-900 p-6 transition-all duration-500 transform-3d">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[8px_8px]" />

                {isActive && (
                    <div
                        className={`absolute inset-0 rounded-2xl bg-linear-to-br ${color} opacity-15 blur-xl`}
                    />
                )}

                <CompetitionIcon
                    className={`relative z-10 h-12 w-12 transition-all duration-500 ${
                        isActive
                            ? 'text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                            : 'text-zinc-500'
                    }`}
                />
            </div>

            <h3 className="line-clamp-2 flex min-h-14 items-center justify-center px-2 text-lg font-black tracking-tight text-white transition-colors duration-300">
                {name}
            </h3>

            <p
                className={`mt-2 line-clamp-3 min-h-16 px-1 text-xs leading-relaxed transition-all duration-500 ${
                    isActive ? 'text-zinc-400' : 'text-zinc-600'
                }`}
            >
                {description}
            </p>

            <div className="mt-6 flex w-full items-center justify-between border-t border-zinc-900/80 pt-4 font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                <span className="text-zinc-600 transition-colors duration-500 group-hover:text-zinc-400">
                    MISSION_STATUS //
                </span>

                <CompetitionStatusBadge status={status} />
            </div>
        </div>
    );
}
