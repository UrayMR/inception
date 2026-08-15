import { Head, usePage } from '@inertiajs/react';
import TransactionDetailTab from '@/features/setting/transaction-detail-tab';
import SettingLayout from '@/layouts/setting-layout';
import type { ITransactionShow } from '@/types';

type TransactionDetailPageProps = {
    transaction: ITransactionShow;
};

export default function TransactionDetailSettingPage() {
    const { transaction } = usePage<TransactionDetailPageProps>().props;

    return (
        <>
            <Head title="Transaction Detail" />

            <TransactionDetailTab transaction={transaction} />
        </>
    );
}

TransactionDetailSettingPage.layout = (page: React.ReactNode) => (
    <SettingLayout>{page}</SettingLayout>
);
