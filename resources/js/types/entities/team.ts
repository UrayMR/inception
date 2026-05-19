import type { Option } from '..';

export interface TeamMember {
    member_name: string;
}

export interface ITeamIndex {
    id: string;
    competition: Option;
    team_name: string;
    leader_name: string;
}

export interface ITeamShow extends ITeamIndex {
    phone_number: string;
    members?: TeamMember[];
    created_at: string;
    updated_at: string;
}

export interface ITeamEdit extends ITeamIndex {
    competition_id: string;
    phone_number: string;
    members?: TeamMember[];
    created_at: string;
    updated_at: string;
}
