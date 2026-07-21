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

    const schemaData = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'INCEPTION',
            url: 'https://inception.himatifaupnvjt.org',
            description:
                'Join the ultimate competition and showcase your skills! Participate in exciting challenges and win amazing prizes.',
            publisher: {
                '@type': 'Organization',
                name: 'Inception',
                logo: 'https://inception.himatifaupnvjt.org/assets/png/og-image.png',
                sameAs: ['https://instagram.com/inception'],
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'INCEPTION 2026',
            description:
                'Join the ultimate competition and showcase your skills! Participate in exciting challenges and win amazing prizes.',
            startDate: '2026-08-10T00:00:00+07:00',
            endDate: '2026-08-28T23:59:59+07:00',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            location: {
                '@type': 'VirtualLocation',
                url: 'https://inception.himatifaupnvjt.org',
            },
            organizer: {
                '@type': 'Organization',
                name: 'HIMATIFA UPNVJT',
                url: 'https://inception.himatifaupnvjt.org',
            },
            image: 'https://inception.himatifaupnvjt.org/assets/png/og-image.png',
        },
    ];

    return (
        <AppLayout>
            <Head>
                <meta name="robots" content="index, follow" />

                <link
                    rel="canonical"
                    href="https://inception.himatifaupnvjt.org"
                />

                <meta
                    name="description"
                    content="Join the ultimate competition and showcase your skills! Participate in exciting challenges, win amazing prizes, and connect with a community of passionate individuals. Don't miss out on this opportunity to shine!"
                />
                <meta
                    name="keywords"
                    content="competition, challenges, prizes, skills, community, showcase, participate, win, events, contests"
                />
                <meta name="author" content="Inception" />
                <meta
                    property="og:title"
                    content="INCEPTION - Power Your Innovation With Inception"
                />
                <meta
                    property="og:description"
                    content="Join the ultimate competition and showcase your skills! Participate in exciting challenges, win amazing prizes, and connect with a community of passionate individuals. Don't miss out on this opportunity to shine!"
                />
                <meta property="og:image" content="/assets/png/og-image.png" />
                <meta
                    property="og:image:alt"
                    content="INCEPTION - Power Your Innovation With Inception"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:url"
                    content="https://inception.himatifaupnvjt.org"
                />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="INCEPTION" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="INCEPTION - Power Your Innovation With Inception"
                />
                <meta
                    name="twitter:description"
                    content="Join the ultimate competition and showcase your skills! Participate in exciting challenges, win amazing prizes, and connect with a community of passionate individuals. Don't miss out on this opportunity to shine!"
                />
                <meta name="twitter:image" content="/assets/png/og-image.png" />
                <meta
                    name="twitter:image:alt"
                    content="INCEPTION - Power Your Innovation With Inception"
                />
                <meta name="twitter:site" content="@inception" />
                <meta name="twitter:creator" content="@inception" />

                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

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
