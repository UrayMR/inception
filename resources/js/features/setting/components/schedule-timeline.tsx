import { Calendar as CalendarIcon } from 'lucide-react';
import { useMemo } from 'react';
import formatDate from '@/helpers/format-date';
import type { CompetitionTimeline } from '@/types';

type EntryStatus = 'pending' | 'ongoing' | 'ended';

function getStatus(entry: CompetitionTimeline, now: Date): EntryStatus {
    const start = new Date(entry.start_at);
    const end = new Date(entry.end_at);

    if (now < start) {
        return 'pending';
    }

    if (now > end) {
        return 'ended';
    }

    return 'ongoing';
}

function getProgress(entry: CompetitionTimeline, now: Date): number {
    const start = new Date(entry.start_at).getTime();
    const end = new Date(entry.end_at).getTime();

    if (end <= start) {
        return 100;
    }

    const pct = ((now.getTime() - start) / (end - start)) * 100;

    return Math.min(100, Math.max(0, pct));
}

const STATUS_LABEL: Record<EntryStatus, string> = {
    pending: 'Pending',
    ongoing: 'Berlangsung',
    ended: 'Selesai',
};

const STATUS_BADGE_CLASS: Record<EntryStatus, string> = {
    pending: 'border-purple-800/50 text-purple-400/70 bg-transparent',
    ongoing:
        'border-purple-400/60 text-purple-200 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.25)]',
    ended: 'border-zinc-800 text-zinc-600 bg-transparent opacity-70',
};

const STATUS_DOT_CLASS: Record<EntryStatus, string> = {
    pending: 'bg-purple-700 ring-4 ring-purple-950/60',
    ongoing:
        'bg-purple-400 ring-4 ring-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,1)]',
    ended: 'bg-zinc-700 ring-4 ring-zinc-900/60',
};

export default function ScheduleTimeline({
    entries,
}: {
    entries?: CompetitionTimeline[];
}) {
    const now = useMemo(() => new Date(), []);

    const sortedEntries = useMemo(() => {
        return (entries ? [...entries] : []).sort(
            (a, b) =>
                new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
        );
    }, [entries]);

    return (
        <div className="lg:col-span-3">
            <div className="flex w-full flex-col rounded-xl border border-purple-500/20 bg-zinc-950/40 p-4 backdrop-blur-md">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between border-b border-purple-950/60 pb-3">
                    <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-purple-400 uppercase">
                        <CalendarIcon className="h-4 w-4 text-purple-500" />
                        <span>Schedule_Manifest</span>
                    </h3>
                </div>

                {/* Timeline */}
                {sortedEntries.length > 0 ? (
                    <div className="flex flex-col">
                        {sortedEntries.map((entry, idx) => {
                            const status = getStatus(entry, now);
                            const isLast = idx === sortedEntries.length - 1;
                            const progress =
                                status === 'ongoing'
                                    ? getProgress(entry, now)
                                    : null;

                            return (
                                <div key={entry.id} className="relative pl-6">
                                    {/* Connector line */}
                                    {!isLast && (
                                        <div className="absolute top-3 bottom-0 left-1.25 w-px bg-purple-900/40" />
                                    )}

                                    {/* Dot */}
                                    <span
                                        className={`absolute top-1.5 left-0 h-2.25 w-2.25 rounded-full ${STATUS_DOT_CLASS[status]}`}
                                    />

                                    {/* Card */}
                                    <div className="mb-4 rounded-lg border border-purple-900/30 bg-purple-950/10 p-3 transition-colors hover:border-purple-700/40">
                                        <div className="mb-1.5 flex items-start justify-between gap-2">
                                            <span className="truncate font-sans text-xs font-medium tracking-wide text-zinc-200">
                                                {entry.timeline_name}
                                            </span>
                                            <span
                                                className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest uppercase ${STATUS_BADGE_CLASS[status]}`}
                                            >
                                                {STATUS_LABEL[status]}
                                            </span>
                                        </div>

                                        <div className="font-mono text-[11px] text-purple-400/70">
                                            {formatDate(entry.start_at, {
                                                short: true,
                                            })}{' '}
                                            -{' '}
                                            {formatDate(entry.end_at, {
                                                short: true,
                                            })}
                                        </div>

                                        {/* Progress bar, hanya untuk yang sedang berlangsung */}
                                        {progress !== null && (
                                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-purple-950/50">
                                                <div
                                                    className="h-full rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)] transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1.5 py-8 text-center font-sans text-zinc-500">
                        <p className="flex items-center gap-2 text-sm font-medium tracking-wide">
                            Belum ada agenda terjadwal.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
