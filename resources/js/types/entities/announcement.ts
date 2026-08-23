import type { AnnouncementStatusType } from '../enums/announcement';

export interface Announcement {
    id: number;
    message: string;
    status: AnnouncementStatusType;
    created_at: string;
    updated_at: string;
}
