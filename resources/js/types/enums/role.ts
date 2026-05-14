export const UserRole = {
    Admin: { value: 'admin', label: 'Admin' },
    Accountant: { value: 'accountant', label: 'Accountant' },
    Participant: { value: 'participant', label: 'Participant' },
} as const;

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole]['value'];
