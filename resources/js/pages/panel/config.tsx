import { Head, useForm } from '@inertiajs/react';
import { SubmitButton } from '@/components/buttons/submit-button';
import { FormField } from '@/components/form-field';
import { MainContent } from '@/components/main-content';
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

type AnnouncementDispatchForm = {
    competitionId: string;
    announcementType: 'final' | 'hacking-day';
    filterType: 'blacklist' | 'whitelist';
    emails: string;
};

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

    const registrationBatchForm = useForm({
        registrationBatchId: activeRegistrationBatch
            ? String(activeRegistrationBatch.id)
            : '',
    });

    const announcementDispatchForm = useForm<AnnouncementDispatchForm>({
        competitionId: '',
        announcementType: 'final',
        filterType: 'whitelist',
        emails: '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (guard(form.data, form.setError)) {
            form.put(panel.announcements.update.url(announcement.id));
        }
    };

    const handleBatchSwitchSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (registrationBatchForm.data.registrationBatchId) {
            registrationBatchForm.put(
                panel.registrationBatches.switch.url(
                    registrationBatchForm.data.registrationBatchId,
                ),
            );
        }
    };

    const handleAnnouncementDispatch = (event: React.FormEvent) => {
        event.preventDefault();
        announcementDispatchForm.post('/panel/configuration/announcement');
    };

    const hasSelectedCompetition =
        announcementDispatchForm.data.competitionId !== '';

    const announcementError = (
        announcementDispatchForm.errors as Record<string, string | undefined>
    ).announcement;

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
                        <h2 className="mb-4 text-2xl font-bold">
                            Kirim Pengumuman
                        </h2>
                        <form
                            onSubmit={handleAnnouncementDispatch}
                            className="space-y-4"
                        >
                            <FormField
                                name="competitionId"
                                label="Kompetisi"
                                required
                            >
                                <Select
                                    value={
                                        announcementDispatchForm.data
                                            .competitionId
                                    }
                                    onValueChange={(value) => {
                                        announcementDispatchForm.setData(
                                            'competitionId',
                                            value,
                                        );
                                        announcementDispatchForm.clearErrors(
                                            'competitionId',
                                        );
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kompetisi" />
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
                                {announcementDispatchForm.errors
                                    .competitionId && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {
                                            announcementDispatchForm.errors
                                                .competitionId
                                        }
                                    </p>
                                )}
                            </FormField>
                            <FormField
                                name="announcementType"
                                label="Jenis pengumuman"
                                required
                            >
                                <Select
                                    value={
                                        announcementDispatchForm.data
                                            .announcementType
                                    }
                                    onValueChange={(value) =>
                                        announcementDispatchForm.setData(
                                            'announcementType',
                                            value as AnnouncementDispatchForm['announcementType'],
                                        )
                                    }
                                    disabled={
                                        announcementDispatchForm.processing ||
                                        !hasSelectedCompetition
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="final">
                                            Final Announcement
                                        </SelectItem>
                                        <SelectItem value="hacking-day">
                                            Hacking Day Announcement
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {announcementDispatchForm.errors
                                    .announcementType && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {
                                            announcementDispatchForm.errors
                                                .announcementType
                                        }
                                    </p>
                                )}
                            </FormField>
                            <FormField
                                name="filterType"
                                label="Tipe Filter"
                                required
                            >
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Blacklist: email yang ditulis menerima
                                    status tidak lolos. <br />
                                    Whitelist: email yang ditulis menerima
                                    status lolos. Semua tim eligible pada
                                    kompetisi tetap menerima email sesuai
                                    statusnya.
                                </p>
                                <Select
                                    value={
                                        announcementDispatchForm.data.filterType
                                    }
                                    onValueChange={(value) =>
                                        announcementDispatchForm.setData(
                                            'filterType',
                                            value as AnnouncementDispatchForm['filterType'],
                                        )
                                    }
                                    disabled={
                                        announcementDispatchForm.processing ||
                                        !hasSelectedCompetition
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries({
                                            blacklist: 'Blacklist',
                                            whitelist: 'Whitelist',
                                        }).map(([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {announcementDispatchForm.errors.filterType && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {
                                            announcementDispatchForm.errors
                                                .filterType
                                        }
                                    </p>
                                )}
                            </FormField>
                            <div>
                                <label
                                    htmlFor="announcement-emails"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email ketua tim
                                    <span className="text-destructive"> *</span>
                                </label>
                                <textarea
                                    id="announcement-emails"
                                    value={announcementDispatchForm.data.emails}
                                    onChange={(event) =>
                                        announcementDispatchForm.setData(
                                            'emails',
                                            event.target.value,
                                        )
                                    }
                                    rows={10}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="ketua.tim1@example.com, ketua.tim2@example.com"
                                    disabled={
                                        announcementDispatchForm.processing ||
                                        !hasSelectedCompetition
                                    }
                                    required
                                />
                                {announcementDispatchForm.errors.emails && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {announcementDispatchForm.errors.emails}
                                    </p>
                                )}
                                {announcementError && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {announcementError}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <SubmitButton
                                    className="ml-auto"
                                    loading={
                                        announcementDispatchForm.processing
                                    }
                                    disabled={
                                        announcementDispatchForm.processing ||
                                        !hasSelectedCompetition ||
                                        !announcementDispatchForm.data.emails
                                    }
                                    label="Cek & Kirim"
                                />
                            </div>
                        </form>
                    </MainContent.Section>
                </MainContent>
            </div>
        </PanelLayout>
    );
}
