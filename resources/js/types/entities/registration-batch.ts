import type { RegistrationBatchStatusType } from '../enums/registration-batch';

export interface RegistrationBatch {
    id: number;
    name: string;
    status: RegistrationBatchStatusType;
    created_at: string;
    updated_at: string;
}
