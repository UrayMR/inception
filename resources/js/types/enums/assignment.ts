export const AssignmentStatusValue = ['inactive', 'active'] as const;

export const AssignmentStatusMap = {
    Inactive: { value: AssignmentStatusValue[0], label: 'Inactive' },
    Active: { value: AssignmentStatusValue[1], label: 'Active' },
} as const;

export type AssignmentStatusType =
    (typeof AssignmentStatusMap)[keyof typeof AssignmentStatusMap]['value'];
