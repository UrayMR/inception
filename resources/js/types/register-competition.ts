import type { CompetitionType, TeamMember } from '@/types';

export type DummyCompetition = {
    id: string;
    slug: string;
    name: string;
    type: CompetitionType;
    fee: number;
    maxMembers: number;
};

export type RegistrationForm = {
    competition_id: string;
    team_name: string;
    leader_name: string;
    leader_email: string;
    phone_number: string;
    institution: string;
    members: TeamMember[];
};
