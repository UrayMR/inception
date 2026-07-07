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

            <div className="relative flex w-full flex-col justify-between overflow-hidden bg-transparent py-6 md:py-10">
                <div className="mb-16 text-center">
                    <span className="mb-4 block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // MISSION_HUB_v1.0
                    </span>
                    <h1 className="mx-auto text-4xl leading-tight font-black tracking-widest text-white uppercase md:text-6xl">
                        Choose Your Mission
                    </h1>
                    <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-amber-400" />
                    <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-purple-200/60">
                        Explore our competitions and find the perfect challenge for you!
                    </p>
                </div>

                <div className="my-auto w-full">
                    <CompetitionCarousel items={competitions.data} />
                </div>
            </div>
        </AppLayout>
    );
}
