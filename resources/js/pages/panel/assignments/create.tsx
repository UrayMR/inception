import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { MainContent } from '@/components/main-content';
import { AssignmentForm } from '@/features/panel/assignment';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import assignments from '@/routes/panel/assignments';
import type { BreadcrumbItem, Option } from '@/types';
import { AssignmentStatusMap } from '@/types';
import type { CreateAssignmentSchemaType } from '@/validations/assignment-schema';
import { CreateAssignmentSchema } from '@/validations/assignment-schema';

export default function CreateAssignmentPage({
    competitions,
}: {
    competitions: Option[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Assignments', href: assignments.index.url() },
        { title: 'Create Assignment', href: assignments.create.url() },
    ];

    const form = useForm<CreateAssignmentSchemaType>({
        competition_id: '',
        name: '',
        assignment_guide_link: '',
        status: AssignmentStatusMap.Active.value,
        due_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Default to 1 day later
    });

    const { guard } = useZod<CreateAssignmentSchemaType>(
        CreateAssignmentSchema,
    );

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.post(assignments.store.url());
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Assignment" />
            <MainContent>
                <MainContent.Header
                    title="Create Assignment"
                    actions={<BackButton href={assignments.index.url()} />}
                />

                <MainContent.Section>
                    <form onSubmit={handleSubmit}>
                        <AssignmentForm
                            mode="create"
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
        </PanelLayout>
    );
}
