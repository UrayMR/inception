import type {
    CompetitionStatusType,
    CompetitionType,
} from '../enums/competition';

export interface CompetitionTimeline {
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
    timelines: CompetitionTimeline[];
    created_at: string;
    updated_at: string;
}

export type ICompetitionEdit = ICompetitionShow;
