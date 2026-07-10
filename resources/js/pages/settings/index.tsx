import { usePage } from '@inertiajs/react';
import type { TransactionProps } from '@/features/setting/dashboard-tab';
import DashboardTab from '@/features/setting/dashboard-tab';
import SettingLayout from '@/layouts/setting-layout';
import type { ICompetitionIndex, ITransactionShow } from '@/types';
import TransactionDetailTab from '@/features/setting/transaction-detail-tab';

type SettingsPageProps = {
    tab: 'dashboard' | 'transaction-detail';
    competition: ICompetitionIndex | null;
    transaction: TransactionProps | null;
    transactionDetail: ITransactionShow | null;
};

export default function Settings() {
    const { tab, competition, transaction, transactionDetail } =
        usePage<SettingsPageProps>().props;

    return (
        <SettingLayout>
            {tab === 'transaction-detail' && transactionDetail ? (
                <TransactionDetailTab transaction={transactionDetail} />
            ) : (
                <DashboardTab
                    competition={competition}
                    transaction={transaction}
                />
            )}
        </SettingLayout>
    );
}
