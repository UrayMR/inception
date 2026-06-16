import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { MainContent } from '@/components/main-content';
import { TeamForm } from '@/features/panel/team/form/team-form';
import PanelLayout from '@/layouts/panel-layout';
import teams from '@/routes/panel/teams';
import type {
    BreadcrumbItem,
    ITeamShow,
    Option,
    TeamMember,
    TeamStatusType,
} from '@/types';
import { TeamStatusMap } from '@/types';

interface ShowTeamForm {
    competition_id: string;
    competition: Option;
    team_name: string;
    institution?: string;
    status: TeamStatusType;
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
        institution: team.institution || '',
        status: team.status || TeamStatusMap.Active.value,
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
                        leaderName={team.leader_name}
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
