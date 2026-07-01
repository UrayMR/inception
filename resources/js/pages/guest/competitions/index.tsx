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

            <div className="relative flex w-full flex-col justify-between overflow-hidden bg-transparent py-4">
                <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-2 px-6 pb-5 select-none md:flex-row md:items-end">
                    <div className="flex flex-col items-center text-center">
                        <p className="font-mono text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase">
                            // MISSION HUB V1.0
                        </p>
                        <h1 className="relative mt-1 pb-2 text-3xl font-black tracking-wide text-white uppercase sm:text-4xl">
                            CHOOSE YOUR MISSION
                            <span className="absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 bg-amber-400 md:w-32" />
                        </h1>
                    </div>
                </div>

                <div className="my-auto w-full">
                    <CompetitionCarousel items={competitions.data} />
                </div>
            </div>
        </AppLayout>
    );
}
