import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import panel from '@/routes/panel';
import type { BreadcrumbItem } from '@/types';

type Leader = {
    name: string | null;
    email: string | null;
};

type Competition = {
    name: string;
};

type AnnouncementTeam = {
    id: string;
    team_name: string;
    leader: Leader | null;
    competition: Competition | null;
    announcement_type: string;
    status: string;
};

type FinalAnnouncementRun = {
    id: string;
    team_id: string;
    announcement_type: string;
    status: string;
    team: AnnouncementTeam | null;
};

type FinalAnnouncementPageProps = {
    finalists: AnnouncementTeam[];
    nonFinalists: AnnouncementTeam[];
    failedEmails: FinalAnnouncementRun[];
};

export default function FinalAnnouncementManagePage({
    finalists,
    nonFinalists,
    failedEmails,
}: FinalAnnouncementPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: panel.dashboard.url() },
        {
            title: 'Pengumuman Final',
            href: panel.finalAnnouncement.manage.url(),
        },
    ];

    const sendForm = useForm({});
    const retryForm = useForm({});

    const hasFailedEmails = failedEmails.length > 0;
    const hasFinalists = finalists.length > 0;

    const urlParams = new URLSearchParams(window.location.search);
    const competitionId = urlParams.get('competitionId');

    const handleSend = () => {
        sendForm.post(
            panel.finalAnnouncement.send.url({
                query: { competitionId },
            }),
        );
    };

    const handleRetry = () => {
        retryForm.post(panel.finalAnnouncement.retry.url());
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengumuman Final" />

            <MainContent>
                <MainContent.Header
                    title={`Manajemen Pengumuman Final`}
                    actions={<BackButton href={panel.configuration.url()} />}
                />

                <MainContent.Section>
                    <div className="space-y-5">
                        {/* Dashboard Cards */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
                                    Total Tim Non-Finalist
                                </p>
                                <p className="text-2xl font-bold">
                                    {nonFinalists.length}
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

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={sendForm.processing || !hasFinalists}
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

                        {/* Finalist Table */}
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
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {finalists.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="p-2 text-center text-muted-foreground"
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
                                                        {finalist.competition
                                                            ?.name ?? '-'}
                                                    </td>

                                                    <td className="p-2">
                                                        {finalist.team_name}
                                                    </td>

                                                    <td className="p-2">
                                                        {finalist.leader
                                                            ?.name ?? '-'}
                                                    </td>

                                                    <td className="p-2">
                                                        {finalist.leader
                                                            ?.email ?? '-'}
                                                    </td>

                                                    <td className="p-2">
                                                        <span
                                                            className={
                                                                finalist.status ===
                                                                'failed'
                                                                    ? 'text-red-500'
                                                                    : finalist.status ===
                                                                        'sent'
                                                                      ? 'text-green-600'
                                                                      : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {finalist.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Failed Emails Table */}
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
                                                    colSpan={5}
                                                    className="p-2 text-center text-muted-foreground"
                                                >
                                                    Belum ada email yang gagal
                                                    dikirim.
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

                        {/* Non-Finalist Table */}
                        <div className="space-y-4 rounded-md border p-4">
                            <h3 className="text-lg font-semibold">
                                Daftar Tim Non-Finalist
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="p-2">Kompetisi</th>
                                            <th className="p-2">Tim</th>
                                            <th className="p-2">Nama Ketua</th>
                                            <th className="p-2">Email Ketua</th>
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {nonFinalists.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="p-2 text-center text-muted-foreground"
                                                >
                                                    Belum ada tim non-finalist.
                                                </td>
                                            </tr>
                                        ) : (
                                            nonFinalists.map((nonFinalist) => (
                                                <tr
                                                    key={nonFinalist.id}
                                                    className="border-b"
                                                >
                                                    <td className="p-2">
                                                        {nonFinalist.competition
                                                            ?.name ?? '-'}
                                                    </td>

                                                    <td className="p-2">
                                                        {nonFinalist.team_name}
                                                    </td>

                                                    <td className="p-2">
                                                        {nonFinalist.leader
                                                            ?.name ?? '-'}
                                                    </td>

                                                    <td className="p-2">
                                                        {nonFinalist.leader
                                                            ?.email ?? '-'}
                                                    </td>

                                                    <td className="p-2">
                                                        <span
                                                            className={
                                                                nonFinalist.status ===
                                                                'failed'
                                                                    ? 'text-red-500'
                                                                    : nonFinalist.status ===
                                                                        'sent'
                                                                      ? 'text-green-600'
                                                                      : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {nonFinalist.status}
                                                        </span>
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
