import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { TeamForm } from '@/components/forms/team-form';
import { MainContent } from '@/components/main-content';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/teams';
import type { BreadcrumbItem } from '@/types';
import { CreateTeamSchema } from '@/validations/team-schema';
import type { CreateTeamSchemaType } from '@/validations/team-schema';

export default function CreateTeamPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teams.index.url() },
        { title: 'Create Team', href: teams.create.url() },
    ];

    const form = useForm<CreateTeamSchemaType>({
        competition_id: '',
        team_name: '',
        phone_number: '',
        members: [
            {
                member_name: '',
            },
        ],
    });

    const { guard } = useZod<CreateTeamSchemaType>(CreateTeamSchema);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.post(teams.store.url());
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Team" />
            <MainContent>
                <MainContent.Header
                    title="Create Team"
                    actions={<BackButton href={teams.index.url()} />}
                />

                <MainContent.Section>
                    <form onSubmit={handleSubmit}>
                        <TeamForm
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
