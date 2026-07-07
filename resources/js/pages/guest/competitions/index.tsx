import { Head } from '@inertiajs/react';
import { CompetitionCarousel } from '@/features/guest/landing-page/components/competition-carousel';
import AppLayout from '@/layouts/app-layout';
import type { ICompetitionCard } from '@/types';

export default function CompetitionsIndex({
    competitions,
}: {
    competitions: { data: ICompetitionCard[] };
}) {
    return (
        <AppLayout>
            <Head title="Choose Your Mission" />

            <div className="relative flex w-full flex-col justify-between overflow-hidden bg-transparent py-10 md:py-16">
                <div className="mb-10 px-4 text-center sm:mb-16">
                    <span className="mb-3 block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // MISSION_HUB_v1.0
                    </span>

                    <h1 className="mx-auto text-3xl leading-tight font-black tracking-widest text-white uppercase md:text-6xl">
                        Choose Your Mission
                    </h1>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />

                    <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-purple-200/60 sm:text-sm">
                        Explore our competitions and find the perfect challenge
                        for you!
                    </p>
                </div>

                <div className="my-auto w-full mx-auto">
                    <CompetitionCarousel items={competitions.data} />
                </div>
            </div>
        </AppLayout>
    );
}
