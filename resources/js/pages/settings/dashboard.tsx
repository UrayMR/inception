import { Head, usePage } from '@inertiajs/react';
import type {
    AssignmentProps,
    TransactionProps,
} from '@/features/setting/dashboard-tab';
import DashboardTab from '@/features/setting/dashboard-tab';
import SettingLayout from '@/layouts/setting-layout';
import type { ICompetitionIndex } from '@/types';

type DashboardPageProps = {
    competition: ICompetitionIndex | null;
    transaction: TransactionProps | null;
    assignments: AssignmentProps[] | null;
};

export default function DashboardSettingPage() {
    const { competition, transaction, assignments } =
        usePage<DashboardPageProps>().props;

    return (
        <>
            <Head title="Dashboard" />

            <DashboardTab
                competition={competition}
                transaction={transaction}
                assignments={assignments}
            />
        </>
    );
}

DashboardSettingPage.layout = (page: React.ReactNode) => (
    <SettingLayout>{page}</SettingLayout>
);
