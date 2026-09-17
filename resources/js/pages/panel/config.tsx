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
import type { Announcement, BreadcrumbItem, RegistrationBatch } from '@/types';
import { RegistrationBatchStatusMap } from '@/types';
import { AnnouncementSchema } from '@/validations/announcement-schema';
import type { AnnouncementSchemaType } from '@/validations/announcement-schema';

interface ConfigPageProps {
    announcement: Announcement;
    registrationBatches: RegistrationBatch[];
}

export default function ConfigPage({
    announcement,
    registrationBatches,
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

                        <hr className="my-8 border-muted" />

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
                </MainContent>
            </div>
        </PanelLayout>
    );
}
