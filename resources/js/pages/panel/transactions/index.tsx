import { Head, usePage, router } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { Button } from '@/components/ui/button';
import { getTransactionColumns } from '@/features/panel/transaction';
import PanelLayout from '@/layouts/panel-layout';
import syncRoute from '@/routes/panel/sync';
import transactions from '@/routes/panel/transactions';
import { TransactionStatusMap } from '@/types';
import type {
    Auth,
    BreadcrumbItem,
    CompetitionOption,
    DataTableProps,
    ITransactionIndex,
    RegistrationBatch,
    SearchParams,
} from '@/types';

type SyncTracker = {
    id: string;
    target_name: string;
    last_synced_id: string;
    last_synced_at: string;
};

type TransactionsPageProps = {
    transactions: DataTableProps<ITransactionIndex>;
    filters: SearchParams;
    auth: Auth;
    registrationBatches: RegistrationBatch[];
    competitions: CompetitionOption[];
    sync: SyncTracker | null;
};

export default function IndexTransactionsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transactions', href: transactions.index.url() },
    ];

    const { props } = usePage<TransactionsPageProps>();

    const [isSyncLoading, setIsSyncLoading] = useState(false);

    const handleSync = () => {
        setIsSyncLoading(true);
        router.post(
            syncRoute.transactions.url(),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsSyncLoading(false),
            },
        );
    };

    const formatLastSynced = (dateString: string) => {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <MainContent>
                <MainContent.Header title="Transactions List" />
                <MainContent.Section>
                    <DataTable<ITransactionIndex>
                        route={transactions.index()}
                        columns={getTransactionColumns(props.transactions.meta)}
                        data={props.transactions.data}
                        meta={props.transactions.meta}
                        links={props.transactions.links}
                        filtersSchema={[
                            {
                                key: 'competition',
                                label: 'Competition',
                                values: Object.values(props.competitions).map(
                                    (competition) => ({
                                        label: competition.name,
                                        value: competition.id,
                                    }),
                                ),
                            },
                            {
                                key: 'registration_batch',
                                label: 'Registration Batch',
                                values: Object.values(
                                    props.registrationBatches,
                                ).map((batch) => ({
                                    label: batch.name,
                                    value: batch.id,
                                })),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                values: Object.values(TransactionStatusMap).map(
                                    (status) => ({
                                        label: status.label,
                                        value: status.value,
                                    }),
                                ),
                            },
                        ]}
                        extraActions={
                            <div className="flex items-center gap-4">
                                {props.sync?.last_synced_at && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Terakhir sync:{' '}
                                        {formatLastSynced(
                                            props.sync.last_synced_at,
                                        )}
                                    </span>
                                )}

                                <Button
                                    onClick={handleSync}
                                    disabled={isSyncLoading}
                                    variant="default"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${isSyncLoading ? 'animate-spin' : ''}`}
                                    />
                                    {isSyncLoading
                                        ? 'Menyinkronkan...'
                                        : 'Sync ke Google Sheet'}
                                </Button>
                            </div>
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
