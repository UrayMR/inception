import { Link } from '@inertiajs/react';
import { ArrowLeft, HistoryIcon } from 'lucide-react';
import formatCurrency from '@/helpers/format-currency';
import formatDate from '@/helpers/format-date';
import utils from '@/routes/utils';
import type { ITransactionShow, TransactionPaymentMethodType } from '@/types';
import { TransactionPaymentMethodMap, TransactionStatusMap } from '@/types';

function statusBadgeClass(status: string) {
    switch (status) {
        case 'success':
        case 'paid':
        case 'done':
            return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
        case 'pending':
        case 'in_review':
            return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
        case 'failed':
        case 'expired':
        case 'cancelled':
            return 'border-red-500/30 bg-red-500/10 text-red-300';
        default:
            return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-300';
    }
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-0.5 text-sm text-zinc-200">{value || '-'}</p>
        </div>
    );
}

export default function TransactionDetailTab({
    transaction,
}: {
    transaction: ITransactionShow;
}) {
    const isSolo = transaction.competition_type === 'solo';

    return (
        <div className="space-y-6">
            <Link
                href="/settings?tab=dashboard"
                only={['tab', 'competition', 'transaction']}
                preserveState
                viewTransition
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-purple-300"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali
            </Link>

            {/* Informasi Transaksi */}
            <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between border-b border-purple-950/60 pb-3">
                    <div>
                        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-200">
                            <HistoryIcon className="h-4 w-4 text-purple-400" />
                            Informasi Transaksi
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            Detail transaksi pembayaran kamu.
                        </p>
                    </div>

                    <span
                        className={`flex h-5 w-fit shrink-0 items-center justify-center rounded-full border px-2 text-[10px] leading-none font-medium uppercase ${statusBadgeClass(
                            transaction.status,
                        )}`}
                    >
                        {TransactionStatusMap[transaction.status]?.label ??
                            transaction.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoRow
                        label="Kompetisi"
                        value={`${transaction.competition_name} (${transaction.competition_type.toUpperCase()})`}
                    />
                    <InfoRow
                        label="Nominal"
                        value={formatCurrency(transaction.amount)}
                    />
                    <InfoRow
                        label="Metode Pembayaran"
                        value={
                            TransactionPaymentMethodMap[
                                transaction.payment_method as TransactionPaymentMethodType
                            ]?.label
                        }
                    />
                    <InfoRow
                        label="Tanggal Transaksi"
                        value={formatDate(transaction.created_at, {
                            long: true,
                        })}
                    />
                </div>
            </div>

            {/* Detail Pengaju (Tim / Solo) */}
            <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                <div className="mb-5 border-b border-purple-950/60 pb-3">
                    <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                        {isSolo ? 'Informasi Peserta' : 'Tim Pengaju'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {!isSolo && (
                        <InfoRow
                            label="Nama Tim"
                            value={transaction.team_name}
                        />
                    )}
                    <InfoRow
                        label="Institusi"
                        value={transaction.institution}
                    />
                    <InfoRow
                        label={isSolo ? 'Nama Lengkap' : 'Ketua Tim'}
                        value={transaction.leader_name}
                    />
                    <InfoRow
                        label={isSolo ? 'Email' : 'Email Ketua Tim'}
                        value={transaction.leader_email}
                    />
                    <InfoRow
                        label="Nomor Telepon"
                        value={transaction.phone_number}
                    />
                </div>

                {/* Anggota Tim hanya muncul jika bertipe tim dan memiliki data anggota */}
                {!isSolo && (transaction.members ?? []).length > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 text-xs text-zinc-500">
                            Anggota Tim
                        </p>
                        <div className="space-y-2 rounded-lg border border-purple-900/30 bg-[#0d071a]/60 p-3">
                            {transaction.members?.map((member, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-zinc-300"
                                >
                                    <span className="font-medium text-zinc-500">
                                        {index + 1}.
                                    </span>
                                    <span>{member.member_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bukti Pembayaran */}
            <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                <div className="mb-5 border-b border-purple-950/60 pb-3">
                    <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                        Bukti Pembayaran
                    </h2>
                </div>
                {transaction.payment_proof_path ? (
                    <div className="flex items-center justify-center">
                        <img
                            src={utils.transactions.paymentProof.url(
                                transaction.id,
                            )}
                            loading="lazy"
                            alt="Bukti Pembayaran"
                            className="max-h-96 rounded-lg border border-purple-900/30 object-contain"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-zinc-400">
                        Belum ada bukti pembayaran yang diunggah.
                    </p>
                )}
            </div>
        </div>
    );
}
