import type { Option } from '..';
import type { TeamStatusType } from '../enums/team';

export interface TeamMember {
    member_name: string;
}

export interface ITeamIndex {
    id: string;
    competition: Option;
    team_name: string;
    leader_name: string;
    status: TeamStatusType;
}

export interface ITeamShow extends ITeamIndex {
    institution?: string;
    phone_number: string;
    requirement_link: string;
    members?: TeamMember[];
    created_at: string;
    updated_at: string;
}

export interface ITeamEdit extends ITeamIndex {
    competition_id: string;
    institution?: string;
    phone_number: string;
    requirement_link: string;
    members?: TeamMember[];
    created_at: string;
    updated_at: string;
}
