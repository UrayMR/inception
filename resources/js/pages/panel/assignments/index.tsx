import { Head, usePage } from '@inertiajs/react';
import { CreateButton } from '@/components/buttons/create-button';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { getAssignmentColumns } from '@/features/panel/assignment';
import PanelLayout from '@/layouts/panel-layout';
import assignments from '@/routes/panel/assignments';
import type {
    Auth,
    BreadcrumbItem,
    DataTableProps,
    IAssignmentIndex,
    SearchParams,
} from '@/types';

type AssignmentPageProps = {
    assignments: DataTableProps<IAssignmentIndex>;
    filters: SearchParams;
    auth: Auth;
};

export default function IndexAssignmentsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Assignments', href: assignments.index.url() },
    ];

    const { props } = usePage<AssignmentPageProps>();

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Assignments" />
            <MainContent>
                <MainContent.Header title="Assignment List" />
                <MainContent.Section>
                    <DataTable<IAssignmentIndex>
                        route={assignments.index()}
                        columns={getAssignmentColumns(props.assignments.meta)}
                        data={props.assignments.data}
                        meta={props.assignments.meta}
                        links={props.assignments.links}
                        extraActions={
                            <CreateButton href={assignments.create.url()} />
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
