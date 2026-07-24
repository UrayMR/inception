import { Head } from '@inertiajs/react';
import { CompetitionCarousel } from '@/features/guest/landing-page/components/competition-carousel';
import AppLayout from '@/layouts/app-layout';
import type { ICompetitionCard } from '@/types';

export default function CompetitionsIndex({
    competitions,
}: {
    competitions: { data: ICompetitionCard[] };
}) {
    const pageUrl = 'https://inception.himatifaupnvjt.org/competitions';
    const pageTitle = 'Choose Your Mission - INCEPTION 2026';
    const pageDescription =
        'Eksplor kompetisi kami dan temukan tantangan yang sempurna untuk Anda! Temukan kompetisi yang sesuai dengan minat dan keahlian Anda di INCEPTION 2026.';

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: competitions.data.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                url: `${pageUrl}/${item.slug}`,
            })),
        },
    };

    return (
        <AppLayout>
            <Head title="Choose Your Mission">
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={pageUrl} />
                <meta name="description" content={pageDescription} />
                <meta
                    name="keywords"
                    content="kompetisi, lomba, tantangan, misi, INCEPTION 2026, kompetisi informatika, lomba informatika, kompetisi nasional, lomba nasional, UI/UX Competition, Data Science Competition, Online Hackathon, Business Plan Competition, mahasiswa, teknologi, kreativitas, inovasi, website lomba, kompetisi teknologi"
                />
                <meta name="author" content="Inception 2026" />

                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta
                    property="og:image"
                    content="/assets/png/seo/seo-thumbnail.png"
                />
                <meta
                    property="og:image:alt"
                    content="INCEPTION 2026 - Choose Your Mission"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="INCEPTION" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content="/assets/png/og-image.png" />
                <meta
                    name="twitter:image:alt"
                    content="INCEPTION 2026 - Choose Your Mission"
                />
                <meta name="twitter:site" content="@inception2026" />
                <meta name="twitter:creator" content="@inception2026" />

                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            <div className="relative flex w-full flex-col justify-between overflow-hidden bg-transparent py-10 md:py-16">
                <div className="mb-10 px-4 text-center sm:mb-16">
                    <span className="mb-3 block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // MISSION_HUB_v1.0
                    </span>

                    <h1 className="mx-auto text-3xl leading-tight font-avalors font-black tracking-widest text-white uppercase md:text-6xl">
                        Choose Your Mission
                    </h1>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />

                    <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-purple-200/60 sm:text-sm">
                        Explore our competitions and find the perfect challenge
                        for you!
                    </p>
                </div>

                <div className="mx-auto my-auto w-full">
                    <CompetitionCarousel items={competitions.data} />
                </div>
            </div>
        </AppLayout>
    );
}
