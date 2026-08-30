import { Head, useForm } from '@inertiajs/react';
import { SubmitButton } from '@/components/buttons/submit-button';
import { MainContent } from '@/components/main-content';
import { AnnouncementForm } from '@/features/panel/announcement';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import panel from '@/routes/panel';
import type { Announcement, BreadcrumbItem } from '@/types';
import { AnnouncementSchema } from '@/validations/announcement-schema';
import type { AnnouncementSchemaType } from '@/validations/announcement-schema';

interface ConfigPageProps {
    announcement: Announcement;
}

export default function ConfigPage({ announcement }: ConfigPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: panel.dashboard() },
        { title: 'Konfigurasi', href: panel.configuration() },
    ];

    const form = useForm<AnnouncementSchemaType>({
        message: announcement.message ?? '',
        status: announcement.status ?? 'active',
    });

    const { guard } = useZod<AnnouncementSchemaType>(AnnouncementSchema);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.put(panel.announcements.update.url(announcement.id));
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
                </MainContent>
            </div>
        </PanelLayout>
    );
}
