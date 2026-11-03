import { Head, usePage } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { CreateButton } from '@/components/buttons/create-button';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { Button } from '@/components/ui/button';
import { getTeamColumns } from '@/features/panel/team';
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
                            <div className="flex gap-2">
                                <CreateButton href={teams.create.url()} />
                                <Button
                                    onClick={() =>
                                        window.open(teams.export.url())
                                    }
                                >
                                    <Upload />
                                    Export
                                </Button>
                            </div>
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
