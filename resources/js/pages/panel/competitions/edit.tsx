import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { CompetitionForm } from '@/components/forms/competition-form';
import { MainContent } from '@/components/main-content';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import competitions from '@/routes/admin/competitions';
import type { BreadcrumbItem, ICompetitionEdit } from '@/types';
import { UpdateCompetitionSchema } from '@/validations/competition-schema';
import type { UpdateCompetitionSchemaType } from '@/validations/competition-schema';

interface EditCompetitionPageProps {
    competition: ICompetitionEdit;
}

export default function EditCompetitionPage({
    competition,
}: EditCompetitionPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Competitions', href: competitions.index.url() },
        {
            title: 'Edit Competition',
            href: competitions.edit.url(competition.slug),
        },
    ];

    const form = useForm<UpdateCompetitionSchemaType>({
        name: competition.name,
        description: competition.description,
        type: competition.type,
        image_file: undefined,
        price: competition.price,
        status: competition.status,
        timelines: competition.timelines,
    });

    const { guard } = useZod<UpdateCompetitionSchemaType>(
        UpdateCompetitionSchema,
    );

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.put(competitions.update.url(competition.slug));
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Competition" />
            <div className="flex flex-col gap-4 p-4">
                <MainContent>
                    <MainContent.Header
                        title="Edit Competition"
                        actions={<BackButton href={competitions.index.url()} />}
                    />

                    <MainContent.Section>
                        <form onSubmit={handleSubmit}>
                            <CompetitionForm
                                mode="edit"
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
            </div>
        </PanelLayout>
    );
}
