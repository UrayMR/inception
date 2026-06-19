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

export default function TimelineSection() {
    const solarRef = useRef<SolarSystemRef>(null);

    return (
        <section className="relative z-10 overflow-hidden px-6 py-32">
            <div className="mb-16 text-center">
                <h2 className="text-3xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_25px_rgba(168,85,247,0.3)] sm:text-5xl">
                    Our {''}
                    <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text font-black text-transparent">
                        Timeline
                    </span>
                </h2>
            </div>

            <div className="relative h-[60vh] overflow-hidden rounded-xl">
                <SolarSystem events={events} ref={solarRef} />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 sm:px-8 lg:px-16">
                    <button
                        onClick={() => solarRef.current?.previous()}
                        className="group pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] backdrop-blur-xl transition duration-300 hover:scale-110 hover:bg-purple-500/30"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <button
                        onClick={() => solarRef.current?.next()}
                        className="group pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] backdrop-blur-xl transition duration-300 hover:scale-110 hover:bg-indigo-500/30"
                    >
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </section>
    );
}
