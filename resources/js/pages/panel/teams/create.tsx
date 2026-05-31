import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { TeamForm } from '@/components/forms/team-form';
import { MainContent } from '@/components/main-content';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/panel/teams';
import type { BreadcrumbItem, CompetitionType, Option } from '@/types';
import { TeamStatusMap } from '@/types';
import { CreateTeamSchema } from '@/validations/team-schema';
import type { CreateTeamSchemaType } from '@/validations/team-schema';

interface CreateTeamPageProps {
    competitionMap: Option[];
}

export default function CreateTeamPage({
    competitionMap,
}: CreateTeamPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teams.index.url() },
        { title: 'Create Team', href: teams.create.url() },
    ];

    const form = useForm<CreateTeamSchemaType>({
        competition_id: '',
        team_name: '',
        institution: '',
        phone_number: '',
        status: TeamStatusMap.Active.value,
        members: [
            {
                member_name: '',
            },
        ],
    });

    const selectedCompetitionType = competitionMap.find(
        (competition) => competition.value === form.data.competition_id,
    )?.otherValues?.type as CompetitionType | undefined;

    const selectedCompetitionMaxMember = Number(
        competitionMap.find(
            (competition) => competition.value === form.data.competition_id,
        )?.otherValues?.max_member ?? 0,
    );

    const { guard } = useZod<CreateTeamSchemaType>(
        CreateTeamSchema(selectedCompetitionType, selectedCompetitionMaxMember),
    );

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
                            competitions={competitionMap}
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
