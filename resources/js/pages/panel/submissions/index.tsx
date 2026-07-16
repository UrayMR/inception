import { Head, usePage } from '@inertiajs/react';
import { CreateButton } from '@/components/buttons/create-button';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { getSubmissionColumns } from '@/features/panel/submission';
import PanelLayout from '@/layouts/panel-layout';
import submissions from '@/routes/panel/submissions';
import type {
    Auth,
    BreadcrumbItem,
    DataTableProps,
    ISubmissionIndex,
    SearchParams,
} from '@/types';

type SubmissionPageProps = {
    submissions: DataTableProps<ISubmissionIndex>;
    filters: SearchParams;
    auth: Auth;
};

export default function IndexSubmissionsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Submissions', href: submissions.index.url() },
    ];

    const { props } = usePage<SubmissionPageProps>();

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Submissions" />
            <MainContent>
                <MainContent.Header title="Submission List" />
                <MainContent.Section>
                    <DataTable<ISubmissionIndex>
                        route={submissions.index()}
                        columns={getSubmissionColumns(props.submissions.meta)}
                        data={props.submissions.data}
                        meta={props.submissions.meta}
                        links={props.submissions.links}
                        extraActions={
                            <CreateButton href={submissions.create.url()} />
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
