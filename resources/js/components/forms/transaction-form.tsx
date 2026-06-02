import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    FormProps,
    TransactionPaymentMethodType,
    TransactionStatusType,
} from '@/types';
import { TransactionPaymentMethodMap, TransactionStatusMap } from '@/types';
import { ImageUploadField } from '../image-upload-field';

type TransactionFormData = {
    competition_name: string;
    team_name: string;
    amount: number;
    payment_method: TransactionPaymentMethodType;
    payment_proof_path: string;
    status: TransactionStatusType;
};

type TransactionFormProps = FormProps<TransactionFormData>;

// TODO: This form is used for show only. We need to create a reusable form for create and edit.
export function TransactionForm({
    mode,
    data,
    errors,
    onChange,
}: TransactionFormProps) {
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    return (
        <div className="space-y-5">
            <FormField name="competition" label="Competition" required>
                <Select disabled={isReadOnly}>
                    <SelectTrigger>{data.competition_name}</SelectTrigger>
                </Select>
            </FormField>

            <FormField
                name="amount"
                label="Amount"
                error={errors.amount}
                required
            >
                <Input
                    id="amount"
                    type="number"
                    value={data.amount}
                    onChange={(e) => onChange('amount', Number(e.target.value))}
                    readOnly={isReadOnly}
                    placeholder="Enter Amount"
                    required
                />
            </FormField>

            <FormField
                name="payment_method"
                label="Payment Method"
                error={errors.payment_method}
                required
            >
                <Select
                    value={data.payment_method}
                    onValueChange={(value) =>
                        onChange(
                            'payment_method',
                            value as TransactionPaymentMethodType,
                        )
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(TransactionPaymentMethodMap).map(
                            (method) => (
                                <SelectItem
                                    key={method.value}
                                    value={method.value}
                                    disabled={isReadOnly}
                                >
                                    {method.label}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField
                name="payment_proof_path"
                label="Payment Proof"
                error={errors.payment_proof_path}
                required
            >
                <ImageUploadField
                    value={data.payment_proof_path}
                    disabled={isReadOnly}
                />
            </FormField>

            <FormField
                name="status"
                label="Status"
                error={errors.status}
                required
            >
                <Select
                    value={data.status}
                    onValueChange={(value) =>
                        onChange('status', value as TransactionStatusType)
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(TransactionStatusMap).map((status) => (
                            <SelectItem
                                key={status.value}
                                value={status.value}
                                disabled={isReadOnly}
                            >
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
        </div>
    );
}
