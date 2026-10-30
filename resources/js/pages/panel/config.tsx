import { Head, router, useForm } from '@inertiajs/react';
import { SubmitButton } from '@/components/buttons/submit-button';
import { FormField } from '@/components/form-field';
import { MainContent } from '@/components/main-content';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AnnouncementForm } from '@/features/panel/announcement';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import panel from '@/routes/panel';
import type {
    Announcement,
    BreadcrumbItem,
    Option,
    RegistrationBatch,
} from '@/types';
import { RegistrationBatchStatusMap } from '@/types';
import { AnnouncementSchema } from '@/validations/announcement-schema';
import type { AnnouncementSchemaType } from '@/validations/announcement-schema';

interface ConfigPageProps {
    announcement: Announcement;
    registrationBatches: RegistrationBatch[];
    competitions: Option[];
}

export default function ConfigPage({
    announcement,
    registrationBatches,
    competitions,
}: ConfigPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: panel.dashboard() },
        { title: 'Konfigurasi', href: panel.configuration() },
    ];

    const form = useForm<AnnouncementSchemaType>({
        message: announcement.message ?? '',
        status: announcement.status ?? 'active',
    });

    const { guard } = useZod<AnnouncementSchemaType>(AnnouncementSchema);

    const activeRegistrationBatch =
        registrationBatches.find(
            (batch) => batch.status === RegistrationBatchStatusMap.Active.value,
        ) ?? registrationBatches[0];

    const registrationBatchForm = useForm<{
        registrationBatchId: string;
    }>({
        registrationBatchId: activeRegistrationBatch
            ? String(activeRegistrationBatch.id)
            : '',
    });

    const finalAnnouncementForm = useForm<{
        whitelist: string;
        competitionId: string;
    }>({
        whitelist: '',
        competitionId: '',
    });

    const bulkAnnouncementForm = useForm<{
        blacklist: string;
    }>({
        blacklist: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.put(panel.announcements.update.url(announcement.id));
    };

    const handleBatchSwitchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!registrationBatchForm.data.registrationBatchId) {
            return;
        }

        registrationBatchForm.put(
            panel.registrationBatches.switch.url(
                registrationBatchForm.data.registrationBatchId,
            ),
        );
    };

    const handleFinalAnnouncementSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!finalAnnouncementForm.data.whitelist) {
            return;
        }

        finalAnnouncementForm.post('/panel/final-announcement/check');
    };

    const handleBulkAnnouncementSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!bulkAnnouncementForm.data.blacklist) {
            return;
        }

        bulkAnnouncementForm.post(panel.bulkAnnouncement.send.url());
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Konfigurasi" />

            <div className="flex flex-col gap-4 p-4">
                <MainContent>
                    <MainContent.Header title="Konfigurasi" />

                    <MainContent.Section>
                        <form onSubmit={handleSubmit}>
                            <AnnouncementForm
                                mode="edit"
                                data={form.data}
                                errors={form.errors}
                                onChange={form.setData}
                            />

                            <div className="mt-4 flex justify-end">
                                <SubmitButton loading={form.processing} />
                            </div>
                        </form>
                    </MainContent.Section>

                    <hr className="my-8 border-muted" />

                    <MainContent.Section>
                        <form onSubmit={handleBatchSwitchSubmit}>
                            <div className="space-y-5">
                                <FormField
                                    name="registrationBatchId"
                                    label="Registration Batch Aktif"
                                    required
                                >
                                    <Select
                                        value={
                                            registrationBatchForm.data
                                                .registrationBatchId
                                        }
                                        onValueChange={(value) =>
                                            registrationBatchForm.setData(
                                                'registrationBatchId',
                                                value,
                                            )
                                        }
                                        disabled={
                                            registrationBatches.length === 0
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih batch" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {registrationBatches.map(
                                                (batch) => (
                                                    <SelectItem
                                                        key={batch.id}
                                                        value={String(batch.id)}
                                                    >
                                                        {batch.name}
                                                        {batch.status ===
                                                        RegistrationBatchStatusMap
                                                            .Active.value
                                                            ? ' (Aktif)'
                                                            : ''}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <div className="flex justify-end">
                                    <SubmitButton
                                        loading={
                                            registrationBatchForm.processing
                                        }
                                        label="Ubah Batch Aktif"
                                        disabled={
                                            registrationBatches.length === 0
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </MainContent.Section>

                    <hr className="my-8 border-muted" />

                    <MainContent.Section>
                        <form
                            onSubmit={handleFinalAnnouncementSubmit}
                            className="space-y-4"
                        >
                            <FormField
                                name="competitionId"
                                label="Competition"
                                required
                            >
                                <Select
                                    value={
                                        finalAnnouncementForm.data.competitionId
                                    }
                                    onValueChange={(value) =>
                                        finalAnnouncementForm.setData(
                                            'competitionId',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kompetisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {competitions.map((competition) => (
                                            <SelectItem
                                                key={competition.value}
                                                value={competition.value}
                                            >
                                                {competition.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <div>
                                <label
                                    htmlFor="whitelist"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email ketua tim yang lolos (Finalist)
                                    <span className="text-destructive"> *</span>
                                </label>
                                <textarea
                                    id="whitelist"
                                    value={finalAnnouncementForm.data.whitelist}
                                    onChange={(event) =>
                                        finalAnnouncementForm.setData(
                                            'whitelist',
                                            event.target.value,
                                        )
                                    }
                                    rows={12}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder={
                                        'ketua.tim1@example.com, ketua.tim2@example.com'
                                    }
                                    disabled={
                                        finalAnnouncementForm.processing ||
                                        !finalAnnouncementForm.data
                                            .competitionId
                                    }
                                    required
                                />
                                {finalAnnouncementForm.errors.whitelist && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {finalAnnouncementForm.errors.whitelist}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Pastikan seluruh email yang masuk whitelist
                                    benar-benar milik ketua tim, terdaftar,
                                    memiliki transaksi terverifikasi, dan telah
                                    mengumpulkan tugas (submission).
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => {
                                        router.visit(
                                            panel.finalAnnouncement.manage({
                                                query: {
                                                    competitionId:
                                                        finalAnnouncementForm
                                                            .data.competitionId,
                                                },
                                            }).url,
                                        );
                                    }}
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                    disabled={
                                        finalAnnouncementForm.processing ||
                                        !finalAnnouncementForm.data
                                            .competitionId
                                    }
                                >
                                    Manage Final Announcement
                                </Button>

                                <SubmitButton
                                    loading={finalAnnouncementForm.processing}
                                    disabled={
                                        finalAnnouncementForm.processing ||
                                        !finalAnnouncementForm.data
                                            .competitionId
                                    }
                                    label="Check & Simpan Whitelist"
                                />
                            </div>
                        </form>
                    </MainContent.Section>

                    <hr className="my-8 border-muted" />

                    <MainContent.Section>
                        <h2 className="mb-4 text-2xl font-bold">
                            Bulk Announcement Hacking Day (Hackathon)
                        </h2>
                        <form
                            onSubmit={handleBulkAnnouncementSubmit}
                            className="space-y-4"
                        >
                            <FormField
                                name="blacklist"
                                label="Email blacklist"
                                required
                            >
                                <textarea
                                    id="blacklist"
                                    value={bulkAnnouncementForm.data.blacklist}
                                    onChange={(event) =>
                                        bulkAnnouncementForm.setData(
                                            'blacklist',
                                            event.target.value,
                                        )
                                    }
                                    rows={8}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder={
                                        'ketua.tim1@example.com, ketua.tim2@example.com'
                                    }
                                    disabled={bulkAnnouncementForm.processing}
                                    required
                                />
                                {bulkAnnouncementForm.errors.blacklist && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {bulkAnnouncementForm.errors.blacklist}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Masukkan email yang dipisahkan koma atau
                                    baris baru. Email dalam daftar ini akan
                                    dikecualikan saat proses bulk announcement.
                                </p>
                            </FormField>

                            <div className="flex justify-end">
                                <SubmitButton
                                    loading={bulkAnnouncementForm.processing}
                                    disabled={bulkAnnouncementForm.processing}
                                    label="Kirim Bulk Announcement"
                                />
                            </div>
                        </form>
                    </MainContent.Section>
                </MainContent>
            </div>
        </PanelLayout>
    );
}
