import { Head, Link } from '@inertiajs/react';
import { Clock, ArrowLeft, DollarSign, FileText } from 'lucide-react';
import ContactBanner from '@/components/contact-banner';
import CompetitionStatusBadge from '@/features/participant/competitions/components/competition-status-badge';
import CTAButton from '@/features/participant/competitions/components/cta-button';
import TimelinePanel from '@/features/participant/competitions/components/timeline-panel';
import { getFileUrl } from '@/helpers/file-url';
import formatCurrency from '@/helpers/format-currency';
import formatDate from '@/helpers/format-date';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import guestCompetitions from '@/routes/guest/competitions';
import { register } from '@/routes/participant/competitions';
import type { ICompetitionShow } from '@/types';

type CompetitionShowPageProps = {
    competition: ICompetitionShow;
    allCompetitions?: ICompetitionShow[];
};

export default function CompetitionShowPage({
    competition,
    allCompetitions = [],
}: CompetitionShowPageProps) {
    const isOpen = competition.status === 'open';

    const isGuideBook =
        competition.guidebook_link && competition.guidebook_link.trim() !== '';

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${competition.name} - INCEPTION`,
        description: `Join ${competition.name} and showcase your skills! ${competition.description}`,
        url: `https://inception.himatifaupnvjt.org/competitions/${competition.slug}`,
        logo: 'https://inception.himatifaupnvjt.org/assets/png/og-image.png',
        sameAs: ['https://instagram.com/inception'],
        event: {
            '@type': 'Event',
            name: `${competition.name} - INCEPTION`,
            startDate: `${competition.timelines[0].start_at}`,
            endDate: `${competition.timelines[0].end_at}`,
            eventStatus: 'https://schema.org/EventScheduled',
            location: `https://inception.himatifaupnvjt.org/competitions/${competition.slug}`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Inception',
        },
    };

    return (
        <AppLayout>
            <Head title={competition.name}>
                <meta name="robots" content="index, follow" />

                <link
                    rel="canonical"
                    href={`https://inception.himatifaupnvjt.org/competitions/${competition.slug}`}
                />

                <meta
                    name="description"
                    content={`${competition.description}`}
                />
                <meta
                    name="keywords"
                    content={`${competition.keywords}, ${competition.name}, Inception 2026, HIMATIFA UPNVJT, Inception, Inception 2026 Competition`}
                />
                <meta name="author" content="Inception 2026" />
                <meta
                    property="og:title"
                    content={`${competition.name} - INCEPTION 2026`}
                />
                <meta
                    property="og:description"
                    content={`${competition.description}`}
                />
                <meta
                    property="og:image"
                    content="/assets/png/seo/seo-thumbnail.png"
                />
                <meta
                    property="og:image:alt"
                    content="INCEPTION 2026 - Code The Future Create The Impact"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:url"
                    content={`https://inception.himatifaupnvjt.org/competitions/${competition.slug}`}
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:site_name"
                    content={`${competition.name} - INCEPTION 2026`}
                />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={`${competition.name} - INCEPTION 2026`}
                />
                <meta
                    name="twitter:description"
                    content={`${competition.description}`}
                />
                <meta
                    name="twitter:image"
                    content="/assets/png/seo/seo-thumbnail.png"
                />
                <meta
                    name="twitter:image:alt"
                    content="INCEPTION 2026 - Code The Future Create The Impact"
                />
                <meta name="twitter:site" content="@inception2026" />
                <meta name="twitter:creator" content="@inception2026" />

                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            <div className="relative w-full bg-transparent py-6 text-zinc-100 selection:bg-purple-500/30 md:py-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6">
                    <div className="flex items-center justify-between border-b border-purple-950/60 pb-4">
                        <Link
                            href={guestCompetitions.index.url()}
                            className="group inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-purple-400"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            <span>[ RETURN_TO_HOME ]</span>
                        </Link>

                        <div className="hidden font-mono text-[10px] tracking-[0.25em] text-purple-400/50 uppercase sm:block">
                            // MISSION_SELECTOR
                        </div>
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
                        <div className="space-y-8 rounded-2xl border border-zinc-800/40 bg-zinc-950/20 p-6 backdrop-blur-md md:p-8">
                            <div className="flex items-center gap-3">
                                <span className="rounded border border-purple-500/20 bg-purple-950/10 px-2 py-0.5 font-mono text-[9px] font-black tracking-widest text-purple-400 uppercase">
                                    {competition.type}
                                </span>
                                <span
                                    className={`flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase ${
                                        isOpen
                                            ? 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400'
                                            : 'border-zinc-800 text-zinc-500'
                                    }`}
                                >
                                    {competition.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h1 className="font-avalors text-4xl leading-tight font-black tracking-widest text-white uppercase sm:text-5xl">
                                    {competition.name}
                                </h1>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 font-mono text-[11px] text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="h-3.5 w-3.5 text-zinc-600" />
                                        <span>
                                            FEE:{' '}
                                            <strong className="font-sans text-white">
                                                {competition.price > 0
                                                    ? formatCurrency(
                                                          competition.price,
                                                      )
                                                    : 'Free'}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-zinc-600" />
                                        <span>
                                            REFRESHED:{' '}
                                            <span className="text-zinc-300">
                                                {formatDate(
                                                    competition.updated_at,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-video max-h-75 w-full overflow-hidden rounded-xl p-3">
                                <img
                                    src={
                                        competition.image_path
                                            ? getFileUrl({
                                                  url: competition.image_path,
                                                  disk: 'public',
                                              })
                                            : '/assets/png/competition-icon.png'
                                    }
                                    alt={competition.name}
                                    className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;

                                        if (
                                            target.src !==
                                            '/assets/png/competition-icon.png'
                                        ) {
                                            target.src =
                                                '/assets/png/competition-icon.png';
                                        }
                                    }}
                                />
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
                                    // MISSION_OBJECTIVE
                                </h3>
                                <p className="font-sans text-sm leading-relaxed tracking-wide text-zinc-300 md:text-base">
                                    {competition.description ||
                                        'Operational target details have not been transmitted yet.'}
                                </p>
                            </div>

                            <div
                                className={cn(
                                    'flex flex-col items-center sm:flex-row',
                                    isGuideBook
                                        ? 'justify-between'
                                        : 'justify-end',
                                    'gap-3',
                                )}
                            >
                                {isGuideBook && (
                                    <a
                                        href={competition.guidebook_link || ''}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/10 px-6 py-3 font-mono text-xs font-bold tracking-widest text-purple-400 uppercase transition-all duration-200 hover:border-purple-500/60 hover:bg-purple-950/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] sm:w-fit"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>GUIDEBOOK</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-2">
                                    <CTAButton
                                        href={register.url({
                                            query: {
                                                competition: competition.slug,
                                            },
                                        })}
                                        isActive={isOpen}
                                    >
                                        {isOpen ? 'REGISTER' : 'LOCKED'}
                                    </CTAButton>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-5 rounded-2xl border border-zinc-800/40 bg-zinc-950/10 p-6 backdrop-blur-md">
                                <TimelinePanel
                                    timelines={competition.timelines}
                                />
                            </div>

                            <div className="space-y-3">
                                <h3 className="pl-1 font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
                                    // MISSION_HUB_INDEX
                                </h3>

                                <div className="space-y-2">
                                    {allCompetitions.length > 0 ? (
                                        allCompetitions.map((item, idx) => {
                                            const isSelected =
                                                item.id === competition.id;

                                            return (
                                                <Link
                                                    prefetch
                                                    key={item.id}
                                                    href={guestCompetitions.show.url(
                                                        item.slug,
                                                    )}
                                                    className={`flex items-center justify-between rounded-xl border p-4 font-mono text-xs uppercase transition-all duration-200 hover:pl-5 ${
                                                        isSelected
                                                            ? 'border-l-2 border-purple-500/40 border-l-purple-500 bg-purple-950/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                                            : 'border-l-2 border-zinc-800/40 border-l-transparent bg-zinc-900/10 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                                    }`}
                                                >
                                                    {/* INFO KIRI */}
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-black tracking-[0.15em] text-zinc-600">
                                                            MISSION_0{idx + 1}
                                                        </span>
                                                        <span className="font-sans font-bold tracking-wide text-zinc-200">
                                                            {item.name}
                                                        </span>
                                                    </div>

                                                    <CompetitionStatusBadge
                                                        status={item.status}
                                                    />
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        /* FALLBACK JIKA DATA KOSONG */
                                        <div className="flex items-center justify-between rounded-xl border border-l-2 border-purple-500/40 border-l-purple-500 bg-purple-950/20 p-4 font-mono text-xs text-white uppercase">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black tracking-[0.15em] text-purple-400">
                                                    ACTIVE_NODE
                                                </span>
                                                <span className="font-sans font-bold tracking-wide">
                                                    {competition.name}
                                                </span>
                                            </div>

                                            <div className="flex w-16.25 shrink-0 items-center justify-end">
                                                <span className="flex w-full items-center justify-center rounded border border-emerald-500/25 bg-emerald-950/30 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400">
                                                    {competition.status}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-purple-950/60">
                        <div className="py-8">
                            <ContactBanner />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
