import type {
    TransactionPaymentMethodType,
    TransactionStatusType,
} from '../enums/transaction';
import type { TeamMember } from './team';

export interface ITransactionIndex {
    id: string;
    team_name: string;
    competition_name: string;
    amount: number;
    status: TransactionStatusType;
}

export interface ITransactionShow {
    id: string;
    amount: number;
    payment_method: TransactionPaymentMethodType;
    payment_proof_path: string;
    status: TransactionStatusType;
    created_at: string;
    updated_at: string;

    competition_name: string;
    competition_type?: string;
    competition_price?: number;

    team_name: string;
    institution?: string;
    phone_number?: string;
    leader_name?: string;
    leader_email?: string;
    members?: TeamMember[];
}
