import { Head, usePage } from '@inertiajs/react';
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

            {/* --- HERO SECTION --- */}
            <HeroSection />

            {/* --- ABOUT SECTION --- */}
            <AboutSection />

            {/* --- CAROUSEL SECTION --- */}
            <CompetitionSection items={competitions.data} />

            {/* --- TIMELINE SECTION --- */}
            <TimelineSection />

            {/* --- FAQ SECTION --- */}
            <FaqSection />

            {/* --- CTA SECTION --- */}
            <CtaSection />
        </AppLayout>
    );
}
