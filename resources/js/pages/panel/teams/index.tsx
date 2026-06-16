import { Head, usePage } from '@inertiajs/react';
import { CreateButton } from '@/components/buttons/create-button';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { getTeamColumns } from '@/features/panel/team/column/team-column';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/panel/teams';
import type {
    Auth,
    BreadcrumbItem,
    DataTableProps,
    ITeamIndex,
    SearchParams,
} from '@/types';

type TeamsPageProps = {
    teams: DataTableProps<ITeamIndex>;
    filters: SearchParams;
    auth: Auth;
};

export default function IndexTeamsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teams.index.url() },
    ];

    const { props } = usePage<TeamsPageProps>();

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Teams" />
            <MainContent>
                <MainContent.Header title="Teams List" />
                <MainContent.Section>
                    <DataTable<ITeamIndex>
                        route={teams.index()}
                        columns={getTeamColumns(props.teams.meta)}
                        data={props.teams.data}
                        meta={props.teams.meta}
                        links={props.teams.links}
                        extraActions={
                            <CreateButton href={teams.create.url()} />
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
