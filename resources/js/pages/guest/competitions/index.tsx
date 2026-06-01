import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CompetitionCard } from '@/components/cards/competition-card';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import AppLayout from '@/layouts/app-layout';
import type { DataTableProps, ICompetitionShow } from '@/types';

export default function CompetitionsIndex() {
    const { competitions } = usePage<{
        competitions: DataTableProps<ICompetitionShow>;
    }>().props;

    const competitionData = competitions.data;
    const links = competitions.links;
    const meta = competitions.meta;

    const [isLoading, setIsLoading] = useState(false);

    const { data: form } = useForm({
        page: meta.current_page,
    });

    const pageCount = useMemo(
        () => Math.max(1, Math.ceil(meta.total / meta.per_page)),
        [meta.total, meta.per_page],
    );

    const navigate = (query: typeof form) => {
        setIsLoading(true);
        router.get('/competitions', query, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handlePageChange = (page: number) => navigate({ ...form, page });

    return (
        <AppLayout>
            <Head title="Competitions" />
            <div className="bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
                    <div className="space-y-3">
                        <p className="text-sm font-medium tracking-[0.22em] text-muted-foreground uppercase">
                            Your next challenge awaits
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Explore our competitions
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Whether you want to build, research, design, or just
                            have fun, there's a competition for you. Join a team
                            or start your own and compete for prizes,
                            mentorship, and glory.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {competitionData.map((competition) => (
                            <CompetitionCard
                                key={competition.name}
                                href={`/competitions/${competition.slug}`}
                                name={competition.name}
                                type={competition.type}
                                status={competition.status}
                                description={
                                    competition.description ||
                                    'Test Description'
                                }
                                startDate={
                                    competition.created_at || '12 June 2026'
                                }
                                endDate={
                                    competition.updated_at || '13 June 2026'
                                }
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <DataTablePagination
                        links={links}
                        meta={meta}
                        pageCount={pageCount}
                        isLoading={isLoading}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
