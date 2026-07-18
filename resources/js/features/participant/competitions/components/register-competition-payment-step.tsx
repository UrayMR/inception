import { Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { FormField } from '@/components/form-field';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import formatCurrency from '@/helpers/format-currency';
import {
    TransactionPaymentMethodMap,
    TransactionPaymentMethodValue,
} from '@/types';
import type { FormErrors, TransactionPaymentMethodType } from '@/types';
import type { RegisterCompetitionFormDataType } from '@/validations/register-competition-schema';
import StepCard from './step-card';

type RegisterCompetitionPaymentStepProps = {
    data: RegisterCompetitionFormDataType;
    errors: FormErrors<RegisterCompetitionFormDataType>;
    canFillTeamDetails: boolean;
    selectedCompetition?: {
        otherValues?: {
            price?: number | string;
        };
    };
    onChange: <K extends keyof RegisterCompetitionFormDataType>(
        key: K,
        value: RegisterCompetitionFormDataType[K],
    ) => void;
};

export default function RegisterCompetitionPaymentStep({
    data,
    errors,
    canFillTeamDetails,
    selectedCompetition,
    onChange,
}: RegisterCompetitionPaymentStepProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isQrisPayment =
        data.payment_method === TransactionPaymentMethodValue[0];
    const rawPrice = selectedCompetition?.otherValues?.price;
    const formattedPrice = rawPrice ? formatCurrency(Number(rawPrice)) : 'Rp 0';

    return (
        <StepCard>
            <div className="space-y-1 border-b border-zinc-800 pb-4">
                <h2 className="font-sans text-xl font-black tracking-tight text-white uppercase">
                    Payment
                </h2>
                <p className="font-mono text-xs text-zinc-500">
                    Select your preferred payment method and upload the payment
                    proof to complete the registration process.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
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
                            disabled={!canFillTeamDetails}
                            required
                        >
                            <SelectTrigger
                                id="payment_method"
                                className="w-full border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                            >
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>

                            <SelectContent className="border-purple-500/20 bg-purple-950 text-white focus-visible:border-0 focus-visible:ring-purple-500/20">
                                {Object.values(TransactionPaymentMethodMap).map(
                                    (method) => (
                                        <SelectItem
                                            className="data-highlighted:bg-purple-500/20 data-highlighted:text-white"
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
                </div>

                {isQrisPayment && (
                    <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-purple-900/30 bg-purple-950/10 p-5 sm:col-span-2 md:flex-row">
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <p className="text-sm font-semibold">
                                        QRIS Payment
                                    </p>
                                </div>
                                <p className="text-xs text-zinc-400">
                                    Scan QRIS code di samping untuk
                                    menyelesaikan pembayaran pendaftaran lomba.
                                </p>
                            </div>

                            <div className="rounded-lg border border-purple-500/10 bg-purple-950/40 p-3">
                                <span className="mb-0.5 block text-xs text-zinc-400">
                                    Total Tagihan:
                                </span>
                                <span className="font-mono text-lg font-bold text-purple-400">
                                    {formattedPrice}
                                </span>
                            </div>

                            <div className="space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
                                <p className="font-semibold">PENTING :</p>
                                <p>
                                    Pastikan Anda mengambil{' '}
                                    <strong>
                                        Screenshot (Tangkapan Layar)
                                    </strong>{' '}
                                    bukti transfer setelah pembayaran berhasil
                                    untuk diunggah di bawah.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <Dialog
                                open={isModalOpen}
                                onOpenChange={setIsModalOpen}
                            >
                                <DialogTrigger asChild>
                                    <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-purple-900/30 bg-white p-2.5 transition-transform">
                                        <img
                                            src="/assets/png/qris-payment-code.png"
                                            alt="QRIS Payment Code"
                                            className="h-44 w-44 object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Maximize2 className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="border-purple-900/40 bg-zinc-950 text-zinc-100 sm:max-w-106.25">
                                    <DialogHeader>
                                        <DialogTitle className="text-base text-zinc-200">
                                            QRIS Payment Code
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-zinc-400">
                                            Pindai kode QR di bawah ini sebesar{' '}
                                            <span className="font-semibold text-purple-400">
                                                {formattedPrice}
                                            </span>
                                            .
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="flex flex-col items-center justify-center gap-4 py-4">
                                        <div className="rounded-2xl border border-purple-500/20 bg-white p-4 shadow-xl">
                                            <img
                                                src="/assets/png/qris-payment-code.png"
                                                alt="QRIS Payment Code Large"
                                                className="mx-auto h-auto w-full max-w-70 object-contain"
                                            />
                                        </div>
                                        <div className="w-full space-y-1 rounded-lg border border-amber-500/10 bg-amber-500/5 p-3 text-center">
                                            <p className="text-xs font-medium text-amber-400">
                                                Jangan lupa{' '}
                                                <strong>Screenshoot</strong>{' '}
                                                setelah pembayaran sukses!
                                            </p>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <span className="font-mono text-[10px] text-zinc-500">
                                Klik QR untuk memperbesar
                            </span>
                        </div>
                    </div>
                )}

                <div className="sm:col-span-2">
                    <FormField
                        name="payment_proof_file"
                        label="Payment Proof"
                        error={errors.payment_proof_file}
                        required
                    >
                        <Input
                            id="payment_proof_file"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) =>
                                onChange(
                                    'payment_proof_file',
                                    event.target.files?.[0],
                                )
                            }
                            className="border-purple-500/20 file:mr-2 file:border-r file:border-zinc-800 file:pr-2 file:text-zinc-200 focus-visible:border-0 focus-visible:ring-purple-500/20"
                            disabled={!canFillTeamDetails}
                            required
                        />
                    </FormField>
                </div>
            </div>
        </StepCard>
    );
}
