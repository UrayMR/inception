import type { IUserAuth } from './entities/user';

export interface Auth {
    user: IUserAuth;
}

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
