import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { getTransactionColumns } from '@/features/panel/transaction';
import PanelLayout from '@/layouts/panel-layout';
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

type TransactionsPageProps = {
    transactions: DataTableProps<ITransactionIndex>;
    filters: SearchParams;
    auth: Auth;
    registrationBatches: RegistrationBatch[];
    competitions: CompetitionOption[];
};

export default function IndexTransactionsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transactions', href: transactions.index.url() },
    ];

    const { props } = usePage<TransactionsPageProps>();

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
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
