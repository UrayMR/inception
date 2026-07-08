import { FormField } from '@/components/form-field';
import { ImageUploadField } from '@/components/image-upload-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import utils from '@/routes/utils';
import type {
    FormProps,
    TeamMember,
    TransactionPaymentMethodType,
    TransactionStatusType,
} from '@/types';
import { TransactionPaymentMethodMap, TransactionStatusMap } from '@/types';

type TransactionFormData = {
    amount: number;
    payment_method: TransactionPaymentMethodType;
    payment_proof_path: string;
    status: TransactionStatusType;
    created_at?: string;
    updated_at?: string;

    competition_name: string;

    team_name: string;
    institution?: string;
    phone_number?: string;
    leader_name?: string;
    leader_email?: string;
    members?: TeamMember[];
};

type TransactionFormProps = FormProps<TransactionFormData> & {
    transactionId: string;
};

// TODO: This form is used for show only. We need to create a reusable form for create and edit.
export function TransactionForm({
    data,
    errors,
    transactionId,
}: TransactionFormProps) {
    return (
        <div className="space-y-8">
            {/* Informasi Transaksi */}
            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                        Informasi Transaksi
                    </h3>
                    <p className="text-sm text-gray-500">
                        Detail transaksi pembayaran.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField name="competition" label="Kompetisi">
                        <Input
                            value={data.competition_name}
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField name="amount" label="Nominal">
                        <Input
                            type="text"
                            value={new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            }).format(data.amount)}
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField name="payment_method" label="Metode Pembayaran">
                        <Select value={data.payment_method} disabled>
                            <SelectTrigger>
                                <SelectValue>
                                    {
                                        TransactionPaymentMethodMap[
                                            data.payment_method
                                        ]?.label
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(TransactionPaymentMethodMap).map(
                                    (method) => (
                                        <SelectItem
                                            key={method.value}
                                            value={method.value}
                                        >
                                            {method.label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField name="status" label="Status">
                        <Select value={data.status} disabled>
                            <SelectTrigger>
                                <SelectValue>
                                    {TransactionStatusMap[data.status]?.label}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(TransactionStatusMap).map(
                                    (status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField name="created_at" label="Tanggal Dibuat">
                        <Input
                            value={
                                data.created_at
                                    ? new Date(data.created_at).toLocaleString(
                                          'id-ID',
                                      )
                                    : '-'
                            }
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField name="updated_at" label="Terakhir Diperbarui">
                        <Input
                            value={
                                data.updated_at
                                    ? new Date(data.updated_at).toLocaleString(
                                          'id-ID',
                                      )
                                    : '-'
                            }
                            readOnly
                            disabled
                        />
                    </FormField>
                </div>
            </section>

            <hr className="border-muted" />

            {/* Informasi Tim Pengaju */}
            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Tim Pengaju</h3>
                    <p className="text-sm text-gray-500">
                        Detail tim yang mengajukan transaksi ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField name="team_name" label="Nama Tim">
                        <Input value={data.team_name} readOnly disabled />
                    </FormField>

                    <FormField name="leader_name" label="Ketua Tim">
                        <Input
                            value={data.leader_name || '-'}
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField name="leader_email" label="Email Ketua Tim">
                        <Input
                            value={data.leader_email || '-'}
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField name="institution" label="Institusi">
                        <Input
                            value={data.institution || '-'}
                            readOnly
                            disabled
                        />
                    </FormField>

                    <FormField name="phone_number" label="Nomor Telepon">
                        <Input
                            value={data.phone_number || '-'}
                            readOnly
                            disabled
                        />
                    </FormField>
                </div>

                {/* Daftar Anggota Tim (kalau kompetisi tipe Team) */}
                {data.members && data.members.length > 0 && (
                    <div className="mt-4">
                        <FormField name="members" label="Anggota Tim">
                            <div className="space-y-2 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
                                {data.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <span className="font-medium text-neutral-500">
                                            {index + 1}.
                                        </span>
                                        <span>{member.member_name}</span>
                                    </div>
                                ))}
                            </div>
                        </FormField>
                    </div>
                )}
            </section>

            <hr className="border-muted" />

            {/* Bukti Pembayaran */}
            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Bukti Pembayaran</h3>
                    <p className="text-sm text-gray-500">
                        Bukti transfer/pembayaran yang diunggah tim.
                    </p>
                </div>

                <FormField
                    name="payment_proof_path"
                    label="Payment Proof"
                    error={errors.payment_proof_path}
                >
                    <ImageUploadField
                        value={data.payment_proof_path}
                        disabled
                        disk="local"
                        customUrl={utils.transactions.paymentProof.url(
                            transactionId,
                        )}
                    />
                </FormField>
            </section>
        </div>
    );
}
