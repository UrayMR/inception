import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { MainContent } from '@/components/main-content';
import { CompetitionForm } from '@/features/panel/competition';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import competitions from '@/routes/panel/competitions';
import type { BreadcrumbItem } from '@/types';
import { CompetitionStatusMap, CompetitionTypeMap } from '@/types';
import { CreateCompetitionSchema } from '@/validations/competition-schema';
import type { CreateCompetitionSchemaType } from '@/validations/competition-schema';

export default function CreateCompetitionPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Competitions', href: competitions.index.url() },
        { title: 'Create Competition', href: competitions.create.url() },
    ];

    const form = useForm<CreateCompetitionSchemaType>({
        name: '',
        description: '',
        type: CompetitionTypeMap.Solo.value,
        image_file: undefined,
        price: 0,
        max_member: 1,
        status: CompetitionStatusMap.Closed.value,
        timelines: [
            {
                timeline_name: '',
                sequence: 1,
                start_at: new Date(),
                end_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Default to 1 day later
                description: '',
            },
        ],
    });

    const { guard } = useZod<CreateCompetitionSchemaType>(
        CreateCompetitionSchema,
    );

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.post(competitions.store.url());
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Competition" />
            <MainContent>
                <MainContent.Header
                    title="Create Competition"
                    actions={<BackButton href={competitions.index.url()} />}
                />

                <MainContent.Section>
                    <form onSubmit={handleSubmit}>
                        <CompetitionForm
                            mode="create"
                            data={form.data}
                            errors={form.errors}
                            onChange={form.setData}
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
