import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { TeamForm } from '@/components/forms/team-form';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/teams';
import type { BreadcrumbItem, ITeamShow, Option, TeamMember } from '@/types';

interface ShowTeamForm {
    competition_id: string;
    competition: Option;
    team_name: string;
    leader_name: string;
    phone_number: string;
    members?: TeamMember[];
}

interface ShowTeamPageProps {
    team: ITeamShow;
}

export default function ShowTeamPage({ team }: ShowTeamPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teams.index.url() },
        {
            title: 'Team Detail',
            href: teams.show.url(team.id),
        },
    ];

    const data: ShowTeamForm = {
        competition_id: team.competition.value,
        team_name: team.team_name,
        competition: team.competition,
        leader_name: team.leader_name,
        phone_number: team.phone_number,
        members: team.members || [],
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Detail" />
            <MainContent>
                <MainContent.Header
                    title="Team Detail"
                    actions={<BackButton href={teams.index.url()} />}
                />
                <MainContent.Section>
                    <TeamForm
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
