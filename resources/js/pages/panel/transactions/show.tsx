import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { MainContent } from '@/components/main-content';
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

type VerificationAction = 'verify' | 'reject';

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

    const form = useForm<{ status: TransactionStatusType }>({
        status: transaction.status,
    });

    const handleVerificationSubmit = (
        e: React.SubmitEvent,
        action: VerificationAction,
    ) => {
        e.preventDefault();

        if (form.data.status !== TransactionStatusMap.pending.value) {
            return;
        }

        const url =
            action === 'verify'
                ? transactions.verify.url(transaction.id)
                : transactions.reject.url(transaction.id);

        form.patch(url);
    };

    const actionsDisabled = isFinalized(form.data.status);

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
                    <div className="mt-4 flex justify-end">
                        <form
                            onSubmit={(e) =>
                                handleVerificationSubmit(e, 'verify')
                            }
                            className="mr-2"
                        >
                            <SubmitButton
                                label="Verify"
                                loading={form.processing}
                                variant="default"
                                loadingLabel="Verifying..."
                                disabled={actionsDisabled}
                            />
                        </form>

                        <form
                            onSubmit={(e) =>
                                handleVerificationSubmit(e, 'reject')
                            }
                            className="ml-2"
                        >
                            <SubmitButton
                                label="Reject"
                                loading={form.processing}
                                variant="destructive"
                                loadingLabel="Rejecting..."
                                disabled={actionsDisabled}
                            />
                        </form>
                    </div>
                </MainContent.Footer>
            </MainContent>
        </PanelLayout>
    );
}
