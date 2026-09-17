export const TransactionPaymentMethodValue = [
    'qris',
    // 'bank_transfer'
] as const;

export const TransactionPaymentMethodMap = {
    qris: { value: 'qris', label: 'QRIS' },

    // Disable this payment method for now, cause its only QRIS.
    // bank_transfer: { value: 'bank_transfer', label: 'Bank Transfer' },
} as const;

export type TransactionPaymentMethodType =
    (typeof TransactionPaymentMethodValue)[number];

export const TransactionStatusMap = {
    pending: { value: 'pending', label: 'Pending' },
    verified: { value: 'verified', label: 'Verified' },
    rejected: { value: 'rejected', label: 'Rejected' },
} as const;

export const TransactionStatusValue = [
    'pending',
    'verified',
    'rejected',
] as const;

export type TransactionStatusType = (typeof TransactionStatusValue)[number];

export const TransactionTypeMap = {
    'batch-1': { value: 'batch-1', label: 'Batch 1' },
    'batch-2': { value: 'batch-2', label: 'Batch 2' },
} as const;

export const TransactionTypeValue = ['batch-1', 'batch-2'] as const;

export type TransactionTypeType = (typeof TransactionTypeValue)[number];
