import type { LucideIcon } from 'lucide-react';
import CompetitionStatusBadge from '@/features/participant/competitions/components/competition-status-badge';
import { getFileUrl } from '@/helpers/file-url';
import { CompetitionStatusMap } from '@/types';
import type { ICompetitionCard } from '@/types';

type CompetitionCardProps = ICompetitionCard & {
    icon?: LucideIcon;
    isActive: boolean;
};

export function CompetitionCard({
    name,
    description,
    status,
    image_path,
    isActive,
}: CompetitionCardProps) {
    const isOpen = status === CompetitionStatusMap.Open.value;

    return (
        <div
            className={`relative flex w-full flex-col items-center rounded-2xl border bg-slate-950/85 p-4 text-center backdrop-blur-xl transition-all duration-500 select-none sm:p-6 ${
                isActive && isOpen
                    ? 'border-purple-500/40 bg-linear-to-b from-slate-950 via-slate-950 to-purple-950/20 shadow-[0_20px_50px_rgba(168,85,247,0.15)] sm:shadow-[0_25px_60px_rgba(168,85,247,0.2)]'
                    : isActive && !isOpen
                      ? 'border-zinc-900/60 bg-linear-to-b from-slate-950 via-slate-950 to-zinc-900/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
                      : 'scale-95 border-zinc-900/40 opacity-40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] duration-300'
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

            <div className="relative mt-1 mb-4 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl p-2 transition-all duration-500 transform-3d sm:mt-2 sm:mb-6 sm:h-50">
                <img
                    src={
                        image_path
                            ? getFileUrl({
                                  url: image_path,
                                  disk: 'public',
                              })
                            : '/assets/png/competition-icon.png'
                    }
                    className={`relative z-10 max-h-full object-contain transition-all duration-500 ${
                        isActive
                            ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                            : 'drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]'
                    }`}
                />
            </div>

            <h3 className="line-clamp-2 flex min-h-12 items-center justify-center px-1 text-base font-black tracking-tight text-white uppercase transition-colors duration-300 sm:min-h-14 sm:text-lg">
                {name}
            </h3>

            <p
                className={`mt-1.5 line-clamp-2 min-h-12 px-1 text-[11px] leading-normal transition-all duration-500 sm:min-h-14 sm:text-xs sm:leading-relaxed ${
                    isActive ? 'text-zinc-400' : 'text-zinc-600'
                }`}
            >
                {description}
            </p>

            <div className="mt-5 flex w-full items-center justify-between border-t border-zinc-900/80 pt-3.5 font-mono text-[8px] font-bold tracking-[0.15em] text-zinc-500 uppercase sm:text-[9px] sm:tracking-[0.2em]">
                <span className="text-zinc-600">STATUS //</span>

                <CompetitionStatusBadge status={status} />
            </div>
        </div>
    );
}
