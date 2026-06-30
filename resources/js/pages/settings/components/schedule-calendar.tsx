import { Calendar as CalendarIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import formatDate from '@/helpers/format-date';
import type { CompetitionTimeline } from '@/types';

export default function ScheduleCalendar({
    entries,
}: {
    entries?: CompetitionTimeline[];
}) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // TODO: better to move this logic to the backend and pass the processed data to the frontend, especially if the number of entries is large. This will reduce the amount of processing done on the client side and improve performance.
    const { highlightDates, bookedDates, allEventDates, upcomingEvents } =
        useMemo(() => {
            const highlights: Date[] = [];
            const booked: Date[] = [];
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Reset time for accurate comparison

            entries?.forEach((entry) => {
                const start = new Date(entry.start_at);
                const end = new Date(entry.end_at);

                highlights.push(start);
                highlights.push(end);

                const current = new Date(start);
                current.setDate(current.getDate() + 1);

                while (current < end) {
                    booked.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                }
            });

            const upcomingEvents = (entries ? [...entries] : [])
                .filter((entry) => new Date(entry.start_at) >= now)
                .sort(
                    (a, b) =>
                        new Date(a.start_at).getTime() -
                        new Date(b.start_at).getTime(),
                )
                .slice(0, 3);

            return {
                highlightDates: highlights,
                bookedDates: booked,
                allEventDates: [...highlights, ...booked],
                upcomingEvents,
            };
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

                {/* Komponen Kalender */}
                <Card className="mx-auto w-fit border-0 bg-transparent p-0">
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            defaultMonth={date}
                            selected={date}
                            onSelect={setDate}
                            disabled={allEventDates}
                            modifiers={{
                                booked: bookedDates,
                                highlighted: highlightDates,
                            }}
                            modifiersClassNames={{
                                booked: '[&>button]:bg-purple-950/30 [&>button]:text-purple-400/80 opacity-90 [&>button]:rounded-none',
                                highlighted:
                                    '[&>button]:border [&>button]:border-amber-500/50 [&>button]:bg-amber-500/10 [&>button]:text-amber-400 [&>button]:font-bold opacity-100 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
                                selected:
                                    '[&>button]:border [&>button]:border-purple-500/40 [&>button]:bg-purple-900/50 [&>button]:text-purple-200 [&>button]:font-semibold',
                            }}
                            className="w-full rounded-md border border-purple-900/40 bg-zinc-950/50"
                            classNames={{
                                button_previous:
                                    'text-purple-400 hover:bg-purple-900/40 hover:text-purple-300 rounded-md transition-colors',
                                button_next:
                                    'text-purple-400 hover:bg-purple-900/40 hover:text-purple-300 rounded-md transition-colors',
                                month_caption:
                                    'text-purple-300 font-mono text-xs tracking-wider uppercase text-center',
                                day: 'text-zinc-400 font-sans text-xs transition-all rounded-md',
                                day_button:
                                    'hover:bg-purple-900/40 hover:text-purple-300 transition-colors',
                                today: 'text-white font-bold [&>button]:border [&>button]:border-purple-500 [&>button]:bg-purple-600/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
                                outside: 'text-zinc-200 opacity-30',
                                disabled: 'cursor-not-allowed',
                            }}
                        />
                    </CardContent>
                </Card>

                <div className="mt-4 space-y-2.5 border-t border-purple-950/60 pt-4 text-xs">
                    {upcomingEvents.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between font-sans text-purple-300"
                        >
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]" />
                                <span className="font-medium tracking-wide text-zinc-200">
                                    {entry.timeline_name}
                                </span>
                            </div>

                            {/* Menampilkan kombinasi Start Date s/d End Date */}
                            <span className="font-mono text-[11px] text-purple-400/80">
                                {formatDate(entry.start_at, { short: true })} -{' '}
                                {formatDate(entry.end_at, { short: true })}
                            </span>
                        </div>
                    ))}

                    {upcomingEvents.length === 0 && (
                        <div className="py-2 text-center font-sans text-zinc-500">
                            Tidak ada agenda terdekat.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
