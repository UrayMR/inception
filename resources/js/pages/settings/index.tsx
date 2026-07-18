import { Head, usePage } from '@inertiajs/react';
import type {
    AssignmentProps,
    TransactionProps,
} from '@/features/setting/dashboard-tab';
import DashboardTab from '@/features/setting/dashboard-tab';
import TransactionDetailTab from '@/features/setting/transaction-detail-tab';
import SettingLayout from '@/layouts/setting-layout';
import type { ICompetitionIndex, ITransactionShow } from '@/types';

// TODO: Fix this hella props use from types
type SettingsPageProps = {
    tab: 'dashboard' | 'transaction-detail';
    competition: ICompetitionIndex | null;
    transaction: TransactionProps | null;
    transactionDetail: ITransactionShow | null;
    assignments: AssignmentProps[] | null;
};

export default function Settings() {
    const { tab, competition, transaction, transactionDetail, assignments } =
        usePage<SettingsPageProps>().props;

    return (
        <SettingLayout>
            <Head title="Settings" />

            {tab === 'transaction-detail' && transactionDetail ? (
                <TransactionDetailTab transaction={transactionDetail} />
            ) : (
                <DashboardTab
                    competition={competition}
                    transaction={transaction}
                    assignments={assignments}
                />
            )}
        </SettingLayout>
    );
}
