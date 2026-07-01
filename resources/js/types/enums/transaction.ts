export const TransactionPaymentMethodValue = ['qris', 'bank_transfer'] as const;

export const TransactionPaymentMethodMap = {
    qris: { value: 'qris', label: 'QRIS' },

    // Disable this payment method for now, cause its only QRIS.
    // bank_transfer: { value: 'bank_transfer', label: 'Bank Transfer' },
} as const;

export type TransactionPaymentMethodType =
    (typeof TransactionPaymentMethodValue)[number];

export const TransactionStatusMap = {
    Pending: { value: 'pending', label: 'Pending' },
    Verified: { value: 'verified', label: 'Verified' },
    Rejected: { value: 'rejected', label: 'Rejected' },
} as const;

export const TransactionStatusValue = [
    'pending',
    'verified',
    'rejected',
] as const;

export type TransactionStatusType = (typeof TransactionStatusValue)[number];
