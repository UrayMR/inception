import { Head, useForm } from '@inertiajs/react';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import type { BreadcrumbItem } from '@/types';

type Leader = {
    name: string | null;
    email: string | null;
};

type Competition = {
    name: string;
};

type FinalistTeam = {
    team_name: string;
    leader: Leader | null;
    competition: Competition | null;
};

type FinalistRecipient = {
    id: string;
    team_id: string;
    team: FinalistTeam | null;
};

type FailedAnnouncement = {
    id: string;
    team_id: string;
    announcement_type: string;
    status: string;
    team: FinalistTeam | null;
};

type FinalAnnouncementPageProps = {
    finalists: FinalistRecipient[];
    failedEmails: FailedAnnouncement[];
};

export default function FinalAnnouncementManagePage({
    finalists,
    failedEmails,
}: FinalAnnouncementPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/panel/dashboard' },
        { title: 'Pengumuman Final', href: '/panel/final-announcement/manage' },
    ];

    const sendForm = useForm({});
    const retryForm = useForm({});

    const hasFailedEmails = failedEmails.length > 0;

    const handleSend = () => {
        sendForm.post('/panel/final-announcement/send');
    };

    const handleRetry = () => {
        retryForm.post('/panel/final-announcement/retry');
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengumuman Final" />

            <MainContent>
                <MainContent.Header title="Manajemen Pengumuman Final" />

                <MainContent.Section>
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">
                                    Total Tim Finalist
                                </p>
                                <p className="text-2xl font-bold">
                                    {finalists.length}
                                </p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">
                                    Total Email Gagal
                                </p>
                                <p className="text-2xl font-bold text-red-500">
                                    {failedEmails.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={sendForm.processing}
                                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                            >
                                {sendForm.processing
                                    ? 'Mengirim...'
                                    : 'Kirim Semua Pengumuman'}
                            </button>

                            <button
                                type="button"
                                onClick={handleRetry}
                                disabled={
                                    retryForm.processing || !hasFailedEmails
                                }
                                className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-500 disabled:opacity-50"
                            >
                                {retryForm.processing
                                    ? 'Retrying...'
                                    : 'Retry Email Gagal'}
                            </button>
                        </div>

                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="text-lg font-semibold">
                                Daftar Tim Finalist
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="p-2">Kompetisi</th>
                                            <th className="p-2">Tim</th>
                                            <th className="p-2">Nama Ketua</th>
                                            <th className="p-2">Email Ketua</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {finalists.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="p-2 text-muted-foreground"
                                                >
                                                    Belum ada tim finalist yang
                                                    tersimpan.
                                                </td>
                                            </tr>
                                        ) : (
                                            finalists.map((finalist) => (
                                                <tr
                                                    key={finalist.id}
                                                    className="border-b"
                                                >
                                                    <td className="p-2">
                                                        {finalist.team
                                                            ?.competition
                                                            ?.name ?? '-'}
                                                    </td>
                                                    <td className="p-2">
                                                        {finalist.team
                                                            ?.team_name ?? '-'}
                                                    </td>
                                                    <td className="p-2">
                                                        {finalist.team?.leader
                                                            ?.name ?? '-'}
                                                    </td>
                                                    <td className="p-2">
                                                        {finalist.team?.leader
                                                            ?.email ?? '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="text-lg font-semibold text-red-500">
                                Daftar Email Gagal
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="p-2">Kompetisi</th>
                                            <th className="p-2">Tim</th>
                                            <th className="p-2">Email Ketua</th>
                                            <th className="p-2">Tipe</th>
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {failedEmails.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="p-2 text-muted-foreground"
                                                >
                                                    Tidak ada email gagal.
                                                </td>
                                            </tr>
                                        ) : (
                                            failedEmails.map((failedEmail) => (
                                                <tr
                                                    key={failedEmail.id}
                                                    className="border-b"
                                                >
                                                    <td className="p-2">
                                                        {failedEmail.team
                                                            ?.competition
                                                            ?.name ?? '-'}
                                                    </td>
                                                    <td className="p-2">
                                                        {failedEmail.team
                                                            ?.team_name ?? '-'}
                                                    </td>
                                                    <td className="p-2">
                                                        {failedEmail.team
                                                            ?.leader?.email ??
                                                            '-'}
                                                    </td>
                                                    <td className="p-2">
                                                        {
                                                            failedEmail.announcement_type
                                                        }
                                                    </td>
                                                    <td className="p-2 text-red-500">
                                                        {failedEmail.status}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
