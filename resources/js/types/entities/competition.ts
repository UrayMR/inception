import type {
    CompetitionStatusType,
    CompetitionType,
} from '../enums/competition';

export interface CompetitionTimeline {
    id?: string;
    timeline_name: string;
    description?: string | null;
    sequence: number;
    start_at: Date;
    end_at: Date;
}

export interface ICompetitionIndex {
    id: string;
    slug: string;
    name: string;
    type: CompetitionType;
    status: CompetitionStatusType;
}

export interface ICompetitionShow extends ICompetitionIndex {
    description?: string | null;
    image_path?: string | null;
    price: number;
    max_member: number;
    guidebook_link?: string | null;
    timelines: CompetitionTimeline[];
    keywords?: string | null;
    created_at: string;
    updated_at: string;
}

export type ICompetitionEdit = ICompetitionShow;
export type ICompetitionRegister = ICompetitionShow;

export type ICompetitionCard = ICompetitionIndex & {
    description?: string | null;
    image_path?: string | null;
};
