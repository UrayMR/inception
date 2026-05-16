// Competition Type
export const CompetitionTypeValue = ['solo', 'team'] as const;

export const CompetitionTypeMap = {
    Solo: { value: CompetitionTypeValue[0], label: 'Solo' },
    Team: { value: CompetitionTypeValue[1], label: 'Team' },
} as const;

export type CompetitionType =
    (typeof CompetitionTypeMap)[keyof typeof CompetitionTypeMap]['value'];

// Competition Status
export const CompetitionStatusValue = [
    'closed',
    'open',
    'ongoing',
    'completed',
] as const;

export const CompetitionStatusMap = {
    Closed: { value: CompetitionStatusValue[0], label: 'Closed' },
    Open: { value: CompetitionStatusValue[1], label: 'Open' },
    Ongoing: { value: CompetitionStatusValue[2], label: 'Ongoing' },
    Completed: { value: CompetitionStatusValue[3], label: 'Completed' },
} as const;

export type CompetitionStatusType =
    (typeof CompetitionStatusMap)[keyof typeof CompetitionStatusMap]['value'];
