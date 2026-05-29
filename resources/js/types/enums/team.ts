export const TeamStatusValue = ['active', 'rejected', 'registered'] as const;

export const TeamStatusMap = {
    Active: { value: TeamStatusValue[0], label: 'Active' },
    Rejected: { value: TeamStatusValue[1], label: 'Rejected' },
    Registered: { value: TeamStatusValue[2], label: 'Registered' },
} as const;

export type TeamStatusType = (typeof TeamStatusValue)[number];
