import type { Option } from '..';
import type { AssignmentStatusType } from '../enums/assignment';

export interface IAssignmentIndex {
    id: string;
    competition: Option;
    name: string;
    status: AssignmentStatusType;
}

export interface IAssignmentShow extends IAssignmentIndex {
    competition_id: string;
    due_at: Date;
    assignment_guide_link: string;
    created_at: string;
    updated_at: string;
}

export type IAssignmentEdit = IAssignmentShow;

export interface ISubmissionIndex {
    id: string;
    competition: Option;
    team: Option;
    submission_link: string;
}
