import { Head, usePage, router } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { Button } from '@/components/ui/button';
import { getTransactionColumns } from '@/features/panel/transaction';
import formatDate from '@/helpers/format-date';
import PanelLayout from '@/layouts/panel-layout';
import syncRoute from '@/routes/panel/sync';
import transactions from '@/routes/panel/transactions';
import { TransactionStatusMap, UserRoleMap } from '@/types';
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
    last_synced_at: string;
    synced_count: number;
    unsynced_count: number;
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

    const isAdmin = props.auth.user.role === UserRoleMap.Admin.value;

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
                            isAdmin ? (
                                <div className="flex items-center gap-4">
                                    {props.sync && (
                                        <div className="flex flex-col items-end text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Terakhir sync:{' '}
                                                {formatDate(
                                                    props.sync.last_synced_at,
                                                    { long: true },
                                                )}
                                            </span>

                                            <span className="mt-0.5 text-xs">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {props.sync.synced_count}{' '}
                                                    tersinkron
                                                </span>
                                                <span className="mx-1.5 text-gray-300 dark:text-gray-600">
                                                    •
                                                </span>
                                                <span
                                                    className={`font-medium ${
                                                        props.sync
                                                            .unsynced_count > 0
                                                            ? 'text-amber-600 dark:text-amber-500'
                                                            : 'text-emerald-600 dark:text-emerald-500'
                                                    }`}
                                                >
                                                    {props.sync.unsynced_count}{' '}
                                                    menunggu
                                                </span>
                                            </span>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSync}
                                        disabled={
                                            isSyncLoading ||
                                            props.sync?.unsynced_count === 0
                                        }
                                        variant="default"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 ${
                                                isSyncLoading
                                                    ? 'animate-spin'
                                                    : ''
                                            }`}
                                        />
                                        {isSyncLoading
                                            ? 'Menyinkronkan...'
                                            : 'Sync ke Google Sheet'}
                                    </Button>
                                </div>
                            ) : null
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
