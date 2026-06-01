import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import capitalize from '@/helpers/capitalize';
import formatCurrency from '@/helpers/format-currency';
import formatDate from '@/helpers/format-date';
import AppLayout from '@/layouts/app-layout';
import guestCompetitions from '@/routes/guest/competitions';
import participantCompetitions from '@/routes/participant/competitions';
import type { ICompetitionShow } from '@/types';

type CompetitionShowPageProps = {
    competition: ICompetitionShow;
};

export default function CompetitionShowPage({
    competition,
}: CompetitionShowPageProps) {
    return (
        <AppLayout>
            <Head title={competition.name} />
            <div className="bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
                    <section className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] dark:bg-[#111111]">
                        <div className="h-2 bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
                        <div className="grid gap-8 p-6 md:grid-cols-[1.4fr_0.9fr] md:p-8">
                            <div className="space-y-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="rounded-full px-3 py-1"
                                    >
                                        {capitalize(competition.type)}
                                    </Badge>
                                    <Badge className="rounded-full px-3 py-1">
                                        {capitalize(competition.status)}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium tracking-[0.22em] text-muted-foreground uppercase">
                                        Competition Detail
                                    </p>
                                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        {capitalize(competition.name)}
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        {competition.description
                                            ? capitalize(
                                                  competition.description,
                                              )
                                            : 'No description has been provided for this competition yet.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        asChild
                                        className="rounded-full px-5"
                                    >
                                        <Link
                                            href={participantCompetitions.register.url(
                                                {
                                                    query: {
                                                        competition:
                                                            competition.slug,
                                                    },
                                                },
                                            )}
                                        >
                                            Register now
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="rounded-full px-5"
                                    >
                                        <Link
                                            href={guestCompetitions.index.url()}
                                        >
                                            Back to competitions
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 rounded-2xl bg-muted/40 p-5 text-sm">
                                <div>
                                    <p className="text-muted-foreground">
                                        Prize
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-foreground">
                                        {competition.price > 0
                                            ? formatCurrency(competition.price)
                                            : 'Free registration'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Created at
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-foreground">
                                        {formatDate(competition.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Last updated
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-foreground">
                                        {formatDate(competition.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="rounded-3xl border border-border/60 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] dark:bg-[#111111]">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Overview
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                {competition.description
                                    ? competition.description
                                    : 'This competition does not have a longer overview yet.'}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-border/60 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] dark:bg-[#111111]">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Timeline
                            </h2>
                            <div className="mt-5 space-y-4">
                                {competition.timelines.length > 0 ? (
                                    competition.timelines.map((timeline) => (
                                        <div
                                            key={timeline.timeline_name}
                                            className="rounded-2xl bg-muted/50 p-4"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h3 className="font-medium text-foreground">
                                                    {capitalize(
                                                        timeline.timeline_name,
                                                    )}
                                                </h3>
                                                <span className="text-xs text-muted-foreground">
                                                    Step {timeline.sequence}
                                                </span>
                                            </div>
                                            {timeline.description ? (
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    {timeline.description}
                                                </p>
                                            ) : null}
                                            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Start
                                                    </p>
                                                    <p className="font-medium text-foreground">
                                                        {formatDate(
                                                            timeline.start_at,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        End
                                                    </p>
                                                    <p className="font-medium text-foreground">
                                                        {formatDate(
                                                            timeline.end_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No timeline has been published for this
                                        competition yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
