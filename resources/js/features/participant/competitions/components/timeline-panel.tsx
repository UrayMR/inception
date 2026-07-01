import formatDate from '@/helpers/format-date';
import type { CompetitionTimeline } from '@/types';

export default function TimelinePanel({
    timelines,
}: {
    timelines: CompetitionTimeline[];
}) {
    return (
        <>
            <h3 className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                <span>TIMELINE</span>
            </h3>
            <div className="relative ml-1.5 space-y-6 border-l border-zinc-800 py-1 pl-4">
                {timelines && timelines.length > 0 ? (
                    timelines.map((timeline) => (
                        <div
                            key={timeline.timeline_name}
                            className="group relative"
                        >
                            <div className="absolute top-1 -left-5.25 h-2 w-2 rounded-full border border-zinc-950 bg-zinc-800 transition-colors group-hover:bg-purple-500" />

                            <div className="space-y-1">
                                <div className="flex items-baseline justify-between gap-4">
                                    <h4 className="font-sans text-xs font-bold tracking-wide text-zinc-200 uppercase transition-colors group-hover:text-white">
                                        {timeline.timeline_name}
                                    </h4>
                                    <span className="font-mono text-[8px] tracking-wider text-zinc-600">
                                        PHASE_0
                                        {timeline.sequence}
                                    </span>
                                </div>
                                {timeline.description && (
                                    <p className="font-sans text-[11px] leading-relaxed text-zinc-400">
                                        {timeline.description}
                                    </p>
                                )}
                                <p className="pt-0.5 font-mono text-[9px] text-zinc-500">
                                    {formatDate(timeline.start_at)} —{' '}
                                    {formatDate(timeline.end_at)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                        // NO_CHRONOLOGY_FOUND
                    </div>
                )}
            </div>
        </>
    );
}
