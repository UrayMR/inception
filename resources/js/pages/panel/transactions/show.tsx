import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { TransactionForm } from '@/components/forms/transaction-form';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import transactions from '@/routes/transactions';
import { TransactionStatusMap } from '@/types';
import type {
    BreadcrumbItem,
    ITransactionShow,
    TransactionPaymentMethodType,
    TransactionStatusType,
} from '@/types';

interface ShowTransactionForm {
    competition_name: string;
    team_name: string;
    amount: number;
    payment_method: TransactionPaymentMethodType;
    payment_proof_path: string;
    status: TransactionStatusType;
}

interface ShowTransactionPageProps {
    transaction: ITransactionShow;
}

// TODO:Refactor about logic for verify and reject, maybe can be put in one function with parameter action = 'verify' | 'reject'
// And refactor about the handleSubmit reject and verify for reusability.
// Refactor the disabled button logic.
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

    const data: ShowTransactionForm = {
        competition_name: transaction.competition_name,
        team_name: transaction.team_name,
        amount: transaction.amount,
        payment_method: transaction.payment_method,
        payment_proof_path: transaction.payment_proof_path,
        status: transaction.status,
    };

    const form = useForm<{ status: TransactionStatusType }>({
        status: transaction.status,
    });

    const handleVerifySubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (form.data.status === TransactionStatusMap.Pending.value) {
            form.patch(transactions.verify.url(transaction.id));
        }
    };

    const handleRejectSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (form.data.status === TransactionStatusMap.Pending.value) {
            form.patch(transactions.reject.url(transaction.id));
        }
    };

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
                        data={data}
                        errors={{}}
                        onChange={() => {}}
                    />
                </MainContent.Section>
                <MainContent.Footer>
                    <div className="mt-4 flex justify-end">
                        <form onSubmit={handleVerifySubmit} className="mr-2">
                            <SubmitButton
                                label="Verify"
                                loading={form.processing}
                                variant="default"
                                loadingLabel="Verifying..."
                                disabled={
                                    form.data.status ===
                                        TransactionStatusMap.Verified.value ||
                                    form.data.status ===
                                        TransactionStatusMap.Rejected.value
                                }
                            />
                        </form>

                        <form onSubmit={handleRejectSubmit} className="ml-2">
                            <SubmitButton
                                label="Reject"
                                loading={form.processing}
                                variant="destructive"
                                loadingLabel="Rejecting..."
                                disabled={
                                    form.data.status ===
                                        TransactionStatusMap.Rejected.value ||
                                    form.data.status ===
                                        TransactionStatusMap.Verified.value
                                }
                            />
                        </form>
                    </div>
                </MainContent.Footer>
            </MainContent>
        </PanelLayout>
    );
}
