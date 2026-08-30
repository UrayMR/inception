import { Calendar } from 'lucide-react';
import { useMemo } from 'react';
import type { TimelineEvent } from '@/types';

const events: TimelineEvent[] = [
    {
        id: 1,
        title: 'Open Registration',
        displayDate: '31 Agustus - 25 September',
        startDate: '2026-08-31T00:00:00',
        endDate: '2026-09-25T23:59:59',
    },
    {
        id: 2,
        title: 'Technical Meeting',
        displayDate: '26 September',
        startDate: '2026-09-26T09:00:00',
        endDate: '2026-09-26T12:35:00',
    },
    {
        id: 3,
        title: 'Hackathon Day',
        displayDate: '17 - 18 Oktober',
        startDate: '2026-10-17T00:00:00',
        endDate: '2026-10-18T23:59:59',
    },
    {
        id: 4,
        title: 'Finalist Announcement',
        displayDate: '15 - 28 Oktober',
        startDate: '2026-10-15T00:00:00',
        endDate: '2026-10-28T23:59:59',
    },
    {
        id: 5,
        title: 'Final Round',
        displayDate: '31 Oktober',
        startDate: '2026-10-31T08:00:00',
        endDate: '2026-10-31T15:23:00',
    },
    {
        id: 6,
        title: 'Winner Announcement',
        displayDate: '31 Oktober',
        startDate: '2026-10-31T15:00:00',
        endDate: '2026-10-31T15:23:00',
    },
];

type Phase = 'logged' | 'live' | 'standby';

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
    standby: { label: 'STANDBY', color: '#52525b', glow: 'rgba(82,82,91,0.2)' },
};

function getPhase(start: Date, end: Date, now: Date): Phase {
    if (now > end) {
        return 'logged';
    }

    if (now >= start) {
        return 'live';
    }

    return 'standby';
}

export default function TimelineSection({ id }: { id: string }) {
    const now = useMemo(() => new Date(), []);

    const phases = useMemo(
        () =>
            events.map((event) =>
                getPhase(
                    new Date(event.startDate),
                    new Date(event.endDate),
                    now,
                ),
            ),
        [now],
    );

    const linePercent = useMemo(() => {
        const segments = events.length - 1;

        if (segments <= 0) {
            return 100;
        }

        let index = 0;

        for (let i = 0; i < events.length; i++) {
            if (phases[i] === 'logged') {
                index = i + 1;
            } else if (phases[i] === 'live') {
                const start = new Date(events[i].startDate).getTime();
                const end = new Date(events[i].endDate).getTime();
                const fraction =
                    end > start
                        ? Math.min(
                              1,
                              Math.max(
                                  0,
                                  (now.getTime() - start) / (end - start),
                              ),
                          )
                        : 1;
                index = i + fraction;
                break;
            } else {
                break;
            }
        }

        return Math.min(100, Math.max(0, (index / segments) * 100));
    }, [phases, now]);

    return (
        <section
            id={id}
            className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:py-32"
        >
            <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-900/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 left-10 -z-10 h-80 w-80 rounded-full bg-cyan-900/15 blur-[100px]" />

            <div className="mb-20 text-center">
                <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                    // LOG_TIMELINE_V2.0
                </span>
                <h2 className="mt-2 font-avalors text-4xl font-extrabold tracking-wider text-white uppercase sm:text-5xl">
                    MISSION TIMELINE
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </div>

            <div className="relative mx-auto max-w-5xl">
                <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-zinc-800/60 lg:left-1/2 lg:-translate-x-1/2" />

                <div
                    className="absolute top-4 left-6 w-0.5 bg-linear-to-b from-purple-400 via-purple-300 to-amber-300 shadow-[0_0_10px_rgba(168,85,247,0.6)] transition-[height] duration-700 ease-out lg:left-1/2 lg:-translate-x-1/2"
                    style={{
                        height: `calc((100% - 2rem) * ${linePercent / 100})`,
                    }}
                />

                <div className="space-y-12 lg:space-y-16">
                    {events.map((event, index) => {
                        const isEven = index % 2 === 0;
                        const phaseNum = String(index + 1).padStart(2, '0');
                        const phase = phases[index];
                        const meta = PHASE_META[phase];

                        return (
                            <div
                                key={event.id}
                                className={`relative flex flex-col lg:flex-row lg:items-center ${
                                    isEven ? 'lg:flex-row-reverse' : ''
                                }`}
                            >
                                <div
                                    className="absolute left-6 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-[#0d0722] lg:left-1/2"
                                    style={{
                                        borderColor: `${meta.color}80`,
                                        boxShadow:
                                            phase === 'standby'
                                                ? 'none'
                                                : `0 0 15px ${meta.glow}`,
                                    }}
                                >
                                    {phase === 'live' && (
                                        <span
                                            className="absolute h-3.5 w-3.5 rounded-full opacity-60 motion-safe:animate-ping"
                                            style={{
                                                backgroundColor: meta.color,
                                            }}
                                        />
                                    )}
                                    <div
                                        className={`relative h-3.5 w-3.5 rounded-full ${
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
                                                phase === 'live'
                                                    ? `0 0 10px ${meta.color}`
                                                    : 'none',
                                        }}
                                    />
                                </div>

                                <div className="ml-14 w-[calc(100%-3.5rem)] lg:ml-0 lg:w-1/2 lg:px-8">
                                    <div
                                        className={`group relative overflow-hidden rounded-2xl border bg-[#0a0518]/70 p-6 backdrop-blur-xl transition-all duration-300 sm:p-7 ${
                                            phase === 'standby'
                                                ? 'border-purple-900/25 opacity-70 hover:opacity-90'
                                                : 'border-purple-900/40 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                                        }`}
                                    >
                                        <div
                                            className="absolute top-0 left-0 h-1 w-20 transition-all duration-500 group-hover:w-full"
                                            style={{
                                                backgroundColor: meta.color,
                                            }}
                                        />

                                        <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
                                            <span className="font-mono text-[11px] font-bold tracking-widest text-purple-400/70 uppercase">
                                                // PHASE_{phaseNum}
                                            </span>
                                            <span
                                                className="font-mono text-xs font-semibold tracking-wider uppercase"
                                                style={{ color: meta.color }}
                                            >
                                                {meta.label}
                                            </span>
                                        </div>

                                        <h3
                                            className={`mt-4 text-xl font-bold tracking-wide sm:text-2xl ${
                                                phase === 'standby'
                                                    ? 'text-zinc-300'
                                                    : 'text-white group-hover:text-purple-100'
                                            }`}
                                        >
                                            {event.title}
                                        </h3>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <div className="inline-flex items-center gap-2 rounded-lg border border-purple-800/40 bg-purple-950/30 px-3.5 py-1.5 text-xs text-purple-200">
                                                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                                                <span className="font-mono">
                                                    {event.displayDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block lg:w-1/2" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
