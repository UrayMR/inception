import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { BackButton } from '@/components/buttons/back-button';
import { MainContent } from '@/components/main-content';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { TransactionForm } from '@/features/panel/transaction';
import PanelLayout from '@/layouts/panel-layout';
import transactions from '@/routes/panel/transactions';
import { TransactionStatusMap } from '@/types';
import type {
    BreadcrumbItem,
    ITransactionShow,
    TransactionStatusType,
} from '@/types';

interface ShowTransactionPageProps {
    transaction: ITransactionShow;
}

const MessageTemplate = {
    verified: {
        defaultMessage: (transaction: ITransactionShow) =>
            `Halo ${transaction.team_name ?? transaction.leader_name}, pembayaran transaksi kamu untuk ${transaction.competition_name} sudah terverifikasi.`,
    },
    rejected: {
        defaultMessage: (transaction: ITransactionShow) =>
            `Halo ${transaction.team_name ?? transaction.leader_name}, maaf transaksi kamu untuk ${transaction.competition_name} belum dapat kami terima.`,
    },
};

const isFinalized = (status: TransactionStatusType) =>
    status === TransactionStatusMap.verified.value ||
    status === TransactionStatusMap.rejected.value;

export default function ShowTransactionPage({
    transaction,
}: ShowTransactionPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transactions', href: transactions.index.url() },
        {
            title: 'Transaction Detail',
            href: transactions.show.url(transaction.id),
        },
    ];

    const verifyForm = useForm({ notify_whatsapp: false });
    const rejectForm = useForm({ notify_whatsapp: false });
    const [verifyMessage, setVerifyMessage] = useState(
        MessageTemplate.verified.defaultMessage(transaction),
    );
    const [rejectMessage, setRejectMessage] = useState(
        MessageTemplate.rejected.defaultMessage(transaction),
    );

    const openWhatsapp = (message: string) => {
        if (!transaction.phone_number) {
            return;
        }

        const phoneNumber = transaction.phone_number.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    const handleVerify = () => {
        verifyForm.patch(transactions.verify.url(transaction.id), {
            onSuccess: () => {
                if (verifyForm.data.notify_whatsapp) {
                    openWhatsapp(verifyMessage);
                }
            },
        });
    };

    const handleReject = () => {
        rejectForm.patch(transactions.reject.url(transaction.id), {
            onSuccess: () => {
                if (rejectForm.data.notify_whatsapp) {
                    openWhatsapp(rejectMessage);
                }
            },
        });
    };

    const actionsDisabled = isFinalized(transaction.status);
    const isProcessing = verifyForm.processing || rejectForm.processing;

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Detail" />
            <MainContent>
                <MainContent.Header
                    title="Transaction Detail"
                    actions={<BackButton href={transactions.index.url()} />}
                />
                <MainContent.Section>
                    <TransactionForm
                        mode="show"
                        data={transaction}
                        errors={{}}
                        onChange={() => {}}
                        transactionId={transaction.id}
                    />
                </MainContent.Section>
                <MainContent.Footer>
                    <div className="mt-4 flex justify-end gap-2">
                        {/* Dialog Verify */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    disabled={actionsDisabled || isProcessing}
                                >
                                    Verify
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Verifikasi transaksi ini?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Transaksi ini akan ditandai sebagai
                                        terverifikasi. Aksi ini tidak dapat
                                        dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <FieldLabel htmlFor="verify-notify-whatsapp">
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="verify-notify-whatsapp"
                                            checked={
                                                verifyForm.data.notify_whatsapp
                                            }
                                            onCheckedChange={(checked) =>
                                                verifyForm.setData(
                                                    'notify_whatsapp',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Informasikan peserta lewat
                                                WhatsApp
                                            </FieldTitle>
                                            <FieldDescription>
                                                Pastikan anda memiliki WhatsApp
                                                yang aktif pada perangkat anda,
                                                atau notifikasi tidak akan
                                                terkirim.
                                            </FieldDescription>
                                            {verifyForm.data
                                                .notify_whatsapp && (
                                                <div className="grid gap-2 pt-1">
                                                    <FieldTitle>
                                                        Pesan WhatsApp
                                                    </FieldTitle>
                                                    <textarea
                                                        value={verifyMessage}
                                                        onChange={(event) =>
                                                            setVerifyMessage(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        rows={4}
                                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                                    />
                                                </div>
                                            )}
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>

                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        disabled={verifyForm.processing}
                                    >
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleVerify}
                                        disabled={verifyForm.processing}
                                    >
                                        {verifyForm.processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Ya, Verifikasi
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Dialog Reject */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={actionsDisabled || isProcessing}
                                >
                                    Reject
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Tolak transaksi ini?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Transaksi ini akan ditandai sebagai
                                        ditolak. Aksi ini tidak dapat
                                        dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <FieldLabel htmlFor="reject-notify-whatsapp">
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="reject-notify-whatsapp"
                                            checked={
                                                rejectForm.data.notify_whatsapp
                                            }
                                            onCheckedChange={(checked) =>
                                                rejectForm.setData(
                                                    'notify_whatsapp',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Informasikan peserta lewat
                                                WhatsApp
                                            </FieldTitle>
                                            <FieldDescription>
                                                Pastikan anda memiliki WhatsApp
                                                yang aktif pada perangkat anda,
                                                atau notifikasi tidak akan
                                                terkirim.
                                            </FieldDescription>
                                            {rejectForm.data
                                                .notify_whatsapp && (
                                                <div className="grid gap-2 pt-1">
                                                    <FieldTitle>
                                                        Pesan WhatsApp
                                                    </FieldTitle>
                                                    <textarea
                                                        value={rejectMessage}
                                                        onChange={(event) =>
                                                            setRejectMessage(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        rows={4}
                                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                                    />
                                                </div>
                                            )}
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>

                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        disabled={rejectForm.processing}
                                    >
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleReject}
                                        disabled={rejectForm.processing}
                                    >
                                        {rejectForm.processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Ya, Tolak
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </MainContent.Footer>
            </MainContent>
        </PanelLayout>
    );
}
