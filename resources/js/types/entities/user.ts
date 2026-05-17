import type { UserRoleType } from '../enums/role';

export interface User {
    id: string;
    google_id?: string;
    name: string;
    email: string;
    email_verified_at?: string;
    role: UserRoleType;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
}

export interface IUserIndex {
    id: string;
    name: string;
    email: string;
    role: UserRoleType;
}

export interface IUserAuth extends IUserIndex {
    google_id?: string;
    created_at: string;
    updated_at: string;
}

export interface IUserShow extends IUserIndex {
    created_at: string;
    updated_at: string;
}

export type IUserEdit = IUserShow;
