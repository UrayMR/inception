import { PlayIcon } from 'lucide-react';

export default function CompetitionStatusBadge({ status }: { status: string }) {
    const isOpen = status === 'open';

    return (
        <div className="flex items-center font-sans text-[10px] font-black tracking-widest">
            {isOpen ? (
                <div className="flex items-center gap-1.5">
                    <PlayIcon className="h-3 -rotate-90 rounded-full text-emerald-400" />
                    <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                        OPEN
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5">
                    <PlayIcon className="h-3 rotate-90 rounded-full text-zinc-500" />
                    <span className="text-zinc-500/60">LOCKED</span>
                </div>
            )}
        </div>
    );
}
