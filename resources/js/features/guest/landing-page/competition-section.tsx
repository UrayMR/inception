import { Link } from '@inertiajs/react';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';
import competitions from '@/routes/guest/competitions';
import type { ICompetitionCard } from '@/types';

export default function CompetitionSection({
    items,
}: {
    items: ICompetitionCard[];
}) {
    const [activeMission, setActiveMission] = useState<ICompetitionCard>(
        items[0] || {},
    );
    const isOpen = activeMission.status === 'open';

    return (
        <section className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-24 lg:px-8">
            {/* HEADER */}
            <div className="mb-12 space-y-3 text-center md:mr-0 md:ml-auto md:max-w-md md:text-right">
                <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                    // MISSION HUB v1.0
                </span>
                <h2 className="text-4xl font-extrabold tracking-wider text-white uppercase sm:text-5xl">
                    Choose Your Mission
                </h2>
                <div className="mx-auto h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] md:mx-0 md:ml-auto" />
            </div>

            {/* GRID CONTAINER */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
                {/* Left Column */}
                <div className="lg:order-1 lg:col-span-8">
                    <div className="relative flex h-full min-h-95 flex-col justify-between overflow-hidden rounded-3xl border border-purple-900/30 bg-[#0d0829]/90 p-8 shadow-[0_25px_60px_rgba(5,2,15,0.7)] md:p-10">
                        <div className="pointer-events-none absolute top-0 left-0 h-12 w-12 rounded-tl-3xl border-t-2 border-l-2 border-purple-500/30" />
                        <div className="pointer-events-none absolute right-0 bottom-0 h-12 w-12 rounded-br-3xl border-r-2 border-b-2 border-purple-500/30" />

                        <div className="flex items-center justify-between border-b border-purple-950/60 pb-4 font-mono text-[10px] tracking-[0.15em] text-purple-300/60">
                            <span>
                                SYSTEM_CORE // MISSION-0
                                {activeMission.id || 'X'}
                            </span>
                            <span
                                className={`rounded-md px-3 py-1 text-[9px] font-bold tracking-widest uppercase ${
                                    isOpen
                                        ? 'border border-purple-500/40 bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                        : 'bg-zinc-900 text-zinc-500'
                                }`}
                            >
                                REG_STATUS: {activeMission.status}
                            </span>
                        </div>

                        <div className="my-auto space-y-4 py-6">
                            <h3 className="font-mono text-3xl tracking-widest text-white uppercase sm:text-4xl">
                                {activeMission.name}
                            </h3>
                            <p className="max-w-xl font-mono text-sm leading-relaxed tracking-wide text-purple-100/70">
                                {activeMission.description ||
                                    'No mission specification loaded. Select a sector from the telemetry board to establish a neural data link.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-purple-950/60 pt-6">
                            <div className="hidden font-mono text-[10px] tracking-wider text-purple-400/40 md:block">
                                SECURE_ENCRYPTION_NODE // ENABLED
                            </div>

                            <Link
                                href={competitions.show(activeMission.slug)}
                                disabled={!isOpen}
                                className={`flex items-center gap-2.5 rounded-xl px-8 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                                    isOpen
                                        ? 'cursor-pointer bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] active:scale-95'
                                        : 'cursor-not-allowed border border-zinc-800 bg-zinc-900/50 text-zinc-600'
                                }`}
                            >
                                <span>INITIALIZE LAUNCH</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col justify-center space-y-4 lg:order-2 lg:col-span-4">
                    {items.map((item, index) => {
                        const isSelected = activeMission.id === item.id;
                        const isItemOpen = item.status === 'open';

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveMission(item)}
                                className={`group relative flex w-full cursor-pointer items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${
                                    isSelected
                                        ? 'border-purple-500/60 bg-purple-950/30 text-white shadow-[0_0_20px_rgba(147,51,234,0.2)]'
                                        : 'border-purple-950/40 bg-[#0f0a26]/40 text-zinc-400 hover:border-purple-900/60 hover:text-white'
                                }`}
                            >
                                {/* Vertical Line Glow Indicator Button */}
                                <div
                                    className={`absolute top-1/2 right-0 h-1/2 w-1 -translate-y-1/2 rounded-l bg-purple-500 shadow-[0_0_8px_#a855f7] transition-all duration-300 ${
                                        isSelected
                                            ? 'scale-100 opacity-100'
                                            : 'scale-50 opacity-0'
                                    }`}
                                />

                                <div className="flex flex-col gap-0.5 pr-4">
                                    <span className="font-mono text-[9px] tracking-widest text-purple-400/70 uppercase">
                                        PHASE_0{index + 1}
                                    </span>
                                    <span className="font-mono text-base tracking-wide uppercase">
                                        {item.name}
                                    </span>
                                </div>

                                <span
                                    className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase ${
                                        isItemOpen
                                            ? 'border border-green-500/40 bg-green-500/20 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                                            : 'bg-zinc-900/20 text-zinc-600'
                                    }`}
                                >
                                    {isItemOpen ? (
                                        <div className="flex items-center gap-1">
                                            <PlayIcon className="h-3 w-3 -rotate-90 text-green-400" />
                                            <span>OPEN</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <PlayIcon className="h-3 w-3 rotate-90 text-zinc-400" />
                                            <span>LOCK</span>
                                        </div>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
