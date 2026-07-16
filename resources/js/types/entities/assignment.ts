import type { AssignmentStatusType } from '../enums/assignment';

export interface IAssignmentIndex {
    id: string;
    competition: {
        value: string;
        label: string;
    };
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
