import { Head, usePage } from '@inertiajs/react';
import { CreateButton } from '@/components/buttons/create-button';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import {
    ExportSubmissionDialog,
    getSubmissionColumns,
} from '@/features/panel/submission';
import PanelLayout from '@/layouts/panel-layout';
import submissions from '@/routes/panel/submissions';
import type {
    Auth,
    BreadcrumbItem,
    DataTableProps,
    ISubmissionIndex,
    Option,
    SearchParams,
} from '@/types';

type SubmissionPageProps = {
    submissions: DataTableProps<ISubmissionIndex>;
    filters: SearchParams;
    auth: Auth;
    competitions: Option[];
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
                            <div className="flex items-center gap-2">
                                {props.competitions.length > 0 && (
                                    <ExportSubmissionDialog
                                        competitions={props.competitions}
                                    />
                                )}
                                <CreateButton href={submissions.create.url()} />
                            </div>
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
