import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { MainContent } from '@/components/main-content';
import { AssignmentForm } from '@/features/panel/assignment';
import PanelLayout from '@/layouts/panel-layout';
import assignments from '@/routes/panel/assignments';
import type {
    BreadcrumbItem,
    AssignmentStatusType,
    IAssignmentShow,
    Option,
} from '@/types';

interface ShowAssignmentForm {
    competition_id: string;
    name: string;
    assignment_guide_link: string;
    status: AssignmentStatusType;
    due_at: Date;
    competition?: Option;
}

interface ShowAssignmentPageProps {
    assignment: IAssignmentShow;
}

export default function ShowAssignmentPage({
    assignment,
}: ShowAssignmentPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Assignments', href: assignments.index.url() },
        {
            title: 'Assignment Detail',
            href: assignments.show.url(assignment.id),
        },
    ];

    const data: ShowAssignmentForm = {
        competition_id: assignment.competition_id,
        name: assignment.name,
        assignment_guide_link: assignment.assignment_guide_link,
        status: assignment.status,
        due_at: assignment.due_at,
        competition: assignment.competition,
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Assignment Detail" />
            <MainContent>
                <MainContent.Header
                    title="Assignment Detail"
                    actions={<BackButton href={assignments.index.url()} />}
                />
                <MainContent.Section>
                    <AssignmentForm
                        mode="show"
                        data={data}
                        errors={{}}
                        onChange={() => {}}
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
