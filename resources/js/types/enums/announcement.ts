export const AnnouncementStatusValue = ['inactive', 'active'] as const;

export const AnnouncementStatusMap = {
    Inactive: { value: AnnouncementStatusValue[0], label: 'Inactive' },
    Active: { value: AnnouncementStatusValue[1], label: 'Active' },
} as const;

export type AnnouncementStatusType =
    (typeof AnnouncementStatusMap)[keyof typeof AnnouncementStatusMap]['value'];
