import { Head, usePage, WhenVisible } from '@inertiajs/react';
import { Skeleton } from '@/components/ui/skeleton';
import AboutSection from '@/features/guest/landing-page/about-section';
import CompetitionSection from '@/features/guest/landing-page/competition-section';
import { CtaSection } from '@/features/guest/landing-page/cta-section';
import FaqSection from '@/features/guest/landing-page/faq-section';
import HeroSection from '@/features/guest/landing-page/hero-section';
import TimelineSection from '@/features/guest/landing-page/timeline-section';
import AppLayout from '@/layouts/app-layout';
import type { ICompetitionCard } from '@/types';

export default function Main() {
    const { competitions } = usePage<{
        competitions: {
            data: ICompetitionCard[];
        };
    }>().props;

    return (
        <AppLayout>
            <Head title="Welcome" />

            <HeroSection id="home" />

            <AboutSection id="about" />

            <WhenVisible
                fallback={
                    <div className="container mx-auto py-12">
                        <Skeleton className="mx-auto h-100 w-full max-w-7xl" />
                    </div>
                }
            >
                <CompetitionSection
                    id="competition"
                    items={competitions.data}
                />
            </WhenVisible>

            <WhenVisible
                fallback={
                    <div className="container mx-auto py-12">
                        <Skeleton className="mx-auto h-125 w-full max-w-7xl" />
                    </div>
                }
            >
                <TimelineSection id="timeline" />
            </WhenVisible>

            <WhenVisible
                fallback={
                    <div className="container mx-auto py-12">
                        <Skeleton className="mx-auto h-62.5 w-full max-w-7xl" />
                    </div>
                }
            >
                <FaqSection id="faq" />
            </WhenVisible>

            <WhenVisible
                fallback={
                    <div className="container mx-auto py-12">
                        <Skeleton className="mx-auto h-125 w-full max-w-7xl" />
                    </div>
                }
            >
                <CtaSection id="cta" />
            </WhenVisible>
        </AppLayout>
    );
}
