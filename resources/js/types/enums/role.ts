export const UserRoleValue = ['admin', 'accountant', 'participant'] as const;

export const UserRoleMap = {
    Admin: { value: UserRoleValue[0], label: 'Admin' },
    Accountant: { value: UserRoleValue[1], label: 'Accountant' },
    Participant: { value: UserRoleValue[2], label: 'Participant' },
} as const;

export type UserRoleType =
    (typeof UserRoleMap)[keyof typeof UserRoleMap]['value'];
