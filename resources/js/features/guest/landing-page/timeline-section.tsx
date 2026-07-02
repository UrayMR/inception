import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useRef } from 'react';
import type { TimelineEvent } from '@/types';
import type { SolarSystemRef } from './components/timeline-orbit/solar-system';
import SolarSystem from './components/timeline-orbit/solar-system';

const events: TimelineEvent[] = [
    {
        id: 1,
        title: 'Open Registration',
        displayDate: '24 Agustus - 4 September',
        radius: 4.0,
        angle: 300,
        color: '#06b6d4',
        size: 0.35,
        defaultPlanet: true,
    },
    {
        id: 2,
        title: 'Technical Meeting',
        displayDate: '5 September',
        radius: 6.5,
        angle: 20,
        color: '#22c55e',
        size: 0.42,
    },
    {
        id: 3,
        title: 'Competition Period',
        displayDate: '6 September - 9 Oktober',
        radius: 9.0,
        angle: 95,
        color: '#a855f7',
        size: 0.5,
    },
    {
        id: 4,
        title: 'Presentation Day',
        displayDate: '10 Oktober',
        radius: 11.5,
        angle: 185,
        color: '#f43f5e',
        size: 0.58,
    },
    {
        id: 5,
        title: 'Announcement of Winners',
        displayDate: '13 Oktober',
        radius: 14.0,
        angle: 70,
        color: '#fbbf24',
        size: 0.68,
    },
];

export default function TimelineSection({id}: {id: string}) {
    const solarRef = useRef<SolarSystemRef>(null);

    return (
        <section id={id} className="relative z-10 overflow-hidden px-6 py-32 max-w-7xl mx-auto">
            <div className="mb-20 space-y-3 text-center">
                <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                    // LOG_TIMELINE
                </span>
                <h2 className="text-4xl font-extrabold tracking-wider text-white uppercase sm:text-5xl">
                    MISSION TIMELINE
                </h2>
                <div className="mx-auto h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
            </div>

            <div className="relative h-[60vh] overflow-hidden rounded-3xl border border-purple-950/40 bg-[#0d0829]/30 shadow-[inset_0_0_40px_rgba(147,51,234,0.05)] backdrop-blur-md">
                <div className="pointer-events-none absolute top-4 left-4 font-mono text-[9px] tracking-widest text-purple-400/40 uppercase">
                    SYS_ORBIT // LOG_READ
                </div>

                <SolarSystem events={events} ref={solarRef} />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 sm:px-8 lg:px-12">
                    <button
                        onClick={() => solarRef.current?.previous()}
                        className="group pointer-events-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-purple-900/50 bg-[#0d0829]/80 text-purple-300 shadow-[0_4px_20px_rgba(5,2,15,0.5)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-purple-500/50 hover:text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] active:scale-95"
                    >
                        <ArrowLeftIcon className="h-5 w-5 transition-transform duration-300" />
                    </button>

                    <button
                        onClick={() => solarRef.current?.next()}
                        className="group pointer-events-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-purple-900/50 bg-[#0d0829]/80 text-purple-300 shadow-[0_4px_20px_rgba(5,2,15,0.5)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-indigo-500/50 hover:text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] active:scale-95"
                    >
                        <ArrowRightIcon className="h-5 w-5 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    );
}
