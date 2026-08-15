import { Calendar as CalendarIcon } from 'lucide-react';
import { useMemo } from 'react';
import formatDate from '@/helpers/format-date';
import type { CompetitionTimeline } from '@/types';

type Phase = 'logged' | 'live' | 'standby';

function getPhase(entry: CompetitionTimeline, now: Date): Phase {
    const start = new Date(entry.start_at);
    const end = new Date(entry.end_at);

    if (now > end) {
        return 'logged';
    }

    if (now >= start) {
        return 'live';
    }

    return 'standby';
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

const PHASE_META: Record<
    Phase,
    { label: string; color: string; glow: string }
> = {
    logged: {
        label: 'LOGGED',
        color: '#a78bfa',
        glow: 'rgba(167,139,250,0.35)',
    },
    live: { label: 'LIVE', color: '#fbbf24', glow: 'rgba(251,191,36,0.55)' },
    standby: {
        label: 'STANDBY',
        color: '#52525b',
        glow: 'rgba(82,82,91,0.2)',
    },
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
                            const phase = getPhase(entry, now);
                            const meta = PHASE_META[phase];
                            const isLast = idx === sortedEntries.length - 1;
                            const progress =
                                phase === 'live'
                                    ? getProgress(entry, now)
                                    : null;

                            return (
                                <div key={entry.id} className="relative pl-6">
                                    {/* Connector line */}
                                    {!isLast && (
                                        <div className="absolute top-3 bottom-0 left-1.25 w-px bg-purple-900/40" />
                                    )}

                                    {/* Dot, gaya sama seperti node di TimelineSection */}
                                    <span className="absolute top-1.5 left-0 flex h-2.25 w-2.25 items-center justify-center">
                                        {phase === 'live' && (
                                            <span
                                                className="absolute h-3.5 w-3.5 rounded-full opacity-60 motion-safe:animate-ping"
                                                style={{
                                                    backgroundColor: meta.color,
                                                }}
                                            />
                                        )}
                                        <span
                                            className={`relative h-2.25 w-2.25 rounded-full ${
                                                phase === 'live'
                                                    ? 'motion-safe:animate-pulse'
                                                    : ''
                                            }`}
                                            style={{
                                                backgroundColor:
                                                    phase === 'standby'
                                                        ? 'transparent'
                                                        : meta.color,
                                                border:
                                                    phase === 'standby'
                                                        ? `1.5px solid ${meta.color}`
                                                        : 'none',
                                                boxShadow:
                                                    phase !== 'standby'
                                                        ? `0 0 8px ${meta.glow}`
                                                        : 'none',
                                            }}
                                        />
                                    </span>

                                    {/* Card */}
                                    <div
                                        className={`mb-4 rounded-lg border p-3 transition-colors ${
                                            phase === 'standby'
                                                ? 'border-purple-900/25 bg-purple-950/5 opacity-70 hover:opacity-90'
                                                : 'border-purple-900/30 bg-purple-950/10 hover:border-purple-700/40'
                                        }`}
                                    >
                                        <div className="mb-1.5 flex items-start justify-between gap-2">
                                            <span className="truncate font-sans text-xs font-medium tracking-wide text-zinc-200">
                                                {entry.timeline_name}
                                            </span>
                                            <span
                                                className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest uppercase"
                                                style={{
                                                    borderColor: `${meta.color}80`,
                                                    color: meta.color,
                                                    backgroundColor:
                                                        phase === 'live'
                                                            ? `${meta.color}1a`
                                                            : 'transparent',
                                                    boxShadow:
                                                        phase === 'live'
                                                            ? `0 0 10px ${meta.glow}`
                                                            : 'none',
                                                }}
                                            >
                                                {meta.label}
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

                                        {progress !== null && (
                                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-purple-950/50">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                        backgroundColor:
                                                            meta.color,
                                                        boxShadow: `0 0 6px ${meta.glow}`,
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
