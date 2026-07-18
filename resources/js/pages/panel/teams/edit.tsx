import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { MainContent } from '@/components/main-content';
import { TeamForm } from '@/features/panel/team';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/panel/teams';
import type {
    BreadcrumbItem,
    CompetitionType,
    ITeamEdit,
    Option,
} from '@/types';
import { TeamStatusMap } from '@/types';
import { UpdateTeamSchema } from '@/validations/team-schema';
import type { UpdateTeamSchemaType } from '@/validations/team-schema';

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

    const form = useForm<UpdateTeamSchemaType>({
        team_name: team.team_name,
        competition_id: team.competition_id,
        institution: team.institution || '',
        phone_number: team.phone_number,
        requirement_link: team.requirement_link,
        status: team.status || TeamStatusMap.Active.value,
        members: team.members || [],
    });

    const selectedCompetitionType = competitionMap.find(
        (competition) => competition.value === form.data.competition_id,
    )?.otherValues?.type as CompetitionType | undefined;

    const selectedCompetitionMaxMember = Number(
        competitionMap.find(
            (competition) => competition.value === form.data.competition_id,
        )?.otherValues?.max_member ?? 0,
    );

    const { guard } = useZod<UpdateTeamSchemaType>(
        UpdateTeamSchema(selectedCompetitionType, selectedCompetitionMaxMember),
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
                                leaderName={team.leader_name}
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
