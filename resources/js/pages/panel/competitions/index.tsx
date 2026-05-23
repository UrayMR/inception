import { Head, usePage } from '@inertiajs/react';
import { CreateButton } from '@/components/buttons/create-button';
import { getCompetitionColumns } from '@/components/columns/competition-column';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import competitions from '@/routes/admin/competitions';
import type {
    Auth,
    BreadcrumbItem,
    DataTableProps,
    ICompetitionIndex,
    SearchParams,
} from '@/types';

type CompetitionsPageProps = {
    competitions: DataTableProps<ICompetitionIndex>;
    filters: SearchParams;
    auth: Auth;
};

export default function IndexCompetitionsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Competitions', href: competitions.index.url() },
    ];

    const { props } = usePage<CompetitionsPageProps>();

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Competitions" />
            <MainContent>
                <MainContent.Header title="Competitions List" />
                <MainContent.Section>
                    <DataTable<ICompetitionIndex>
                        route={competitions.index()}
                        columns={getCompetitionColumns(props.competitions.meta)}
                        data={props.competitions.data}
                        meta={props.competitions.meta}
                        links={props.competitions.links}
                        extraActions={
                            <CreateButton href={competitions.create.url()} />
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
