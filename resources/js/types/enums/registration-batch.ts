export const RegistrationBatchStatusValue = ['inactive', 'active'] as const;

export const RegistrationBatchStatusMap = {
    Inactive: { value: RegistrationBatchStatusValue[0], label: 'Inactive' },
    Active: { value: RegistrationBatchStatusValue[1], label: 'Active' },
} as const;

export type RegistrationBatchStatusType =
    (typeof RegistrationBatchStatusMap)[keyof typeof RegistrationBatchStatusMap]['value'];
