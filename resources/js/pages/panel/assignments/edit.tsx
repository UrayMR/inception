import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { MainContent } from '@/components/main-content';
import { AssignmentForm } from '@/features/panel/assignment';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import assignments from '@/routes/panel/assignments';
import type { BreadcrumbItem, IAssignmentEdit, Option } from '@/types';
import { UpdateAssignmentSchema } from '@/validations/assignment-schema';
import type { UpdateAssignmentSchemaType } from '@/validations/assignment-schema';

interface EditAssignmentPageProps {
    assignment: IAssignmentEdit;
    competitions: Option[];
}

export default function EditAssignmentPage({
    assignment,
    competitions,
}: EditAssignmentPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Assignments', href: assignments.index.url() },
        {
            title: 'Edit Assignment',
            href: assignments.edit.url(assignment.id),
        },
    ];

    const form = useForm<UpdateAssignmentSchemaType>({
        competition_id: assignment.competition_id,
        name: assignment.name,
        assignment_guide_link: assignment.assignment_guide_link,
        status: assignment.status,
        due_at: assignment.due_at,
    });

    const { guard } = useZod<UpdateAssignmentSchemaType>(
        UpdateAssignmentSchema,
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.put(assignments.update.url(assignment.id));
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Assignment" />
            <div className="flex flex-col gap-4 p-4">
                <MainContent>
                    <MainContent.Header
                        title="Edit Assignment"
                        actions={<BackButton href={assignments.index.url()} />}
                    />

                    <MainContent.Section>
                        <form onSubmit={handleSubmit}>
                            <AssignmentForm
                                mode="edit"
                                data={form.data}
                                errors={form.errors}
                                onChange={form.setData}
                                competitions={competitions}
                            />

                            <div className="mt-4 flex justify-end">
                                <SubmitButton loading={form.processing} />
                            </div>
                        </form>
                    </MainContent.Section>
                </MainContent>
            </div>
        </PanelLayout>
    );
}
