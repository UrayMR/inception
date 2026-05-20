import type {
    TransactionPaymentMethodType,
    TransactionStatusType,
} from '../enums/transaction';

export interface ITransactionIndex {
    id: string;
    team_name: string;
    competition_name: string;
    amount: number;
    status: TransactionStatusType;
}

export interface ITransactionShow {
    id: string;
    team_name: string;
    competition_name: string;
    amount: number;
    payment_method: TransactionPaymentMethodType;
    payment_proof_path: string;
    status: TransactionStatusType;
    created_at: string;
    updated_at: string;
}
