import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { TeamForm } from '@/components/forms/team-form';
import { MainContent } from '@/components/main-content';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/teams';
import type {
    BreadcrumbItem,
    CompetitionType,
    ITeamEdit,
    Option,
} from '@/types';
import { UpdateTeamSchema } from '@/validations/team-schema';
import type { UpdateTeamSchemaType } from '@/validations/team-schema';

type EditTeamFormData = UpdateTeamSchemaType & {
    leader_name: string;
};

interface EditTeamPageProps {
    team: ITeamEdit;
    competitionMap: Option[];
}

export default function EditTeamPage({
    team,
    competitionMap,
}: EditTeamPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teams.index.url() },
        {
            title: 'Edit Team',
            href: teams.edit.url(team.id),
        },
    ];

    const form = useForm<EditTeamFormData>({
        team_name: team.team_name,
        competition_id: team.competition_id,
        leader_name: team.leader_name,
        phone_number: team.phone_number,
        members: team.members || [],
    });

    const selectedCompetitionType = competitionMap.find(
        (competition) => competition.value === form.data.competition_id,
    )?.otherValues?.type as CompetitionType | undefined;

    const { guard } = useZod<UpdateTeamSchemaType>(
        UpdateTeamSchema(selectedCompetitionType),
    );

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.put(teams.update.url(team.id));
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Team" />
            <div className="flex flex-col gap-4 p-4">
                <MainContent>
                    <MainContent.Header
                        title="Edit Team"
                        actions={<BackButton href={teams.index.url()} />}
                    />

                    <MainContent.Section>
                        <form onSubmit={handleSubmit}>
                            <TeamForm
                                mode="edit"
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
            </div>
        </PanelLayout>
    );
}
