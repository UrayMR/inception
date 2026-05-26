import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { UserForm } from '@/components/forms/user-form';
import { MainContent } from '@/components/main-content';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import users from '@/routes/panel/users';
import type { BreadcrumbItem } from '@/types';
import { UserRoleMap } from '@/types';
import { CreateUserSchema } from '@/validations/user-schema';
import type { CreateUserSchemaType } from '@/validations/user-schema';

export default function CreateUserPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: users.index.url() },
        { title: 'Create User', href: users.create.url() },
    ];

    const form = useForm<CreateUserSchemaType>({
        name: '',
        email: '',
        role: UserRoleMap.Participant.value,
        password: '',
        password_confirmation: '',
    });

    const { guard } = useZod<CreateUserSchemaType>(CreateUserSchema);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.post(users.store.url());
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <MainContent>
                <MainContent.Header
                    title="Create User"
                    actions={<BackButton href={users.index.url()} />}
                />

                <MainContent.Section>
                    <form onSubmit={handleSubmit}>
                        <UserForm
                            mode="create"
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
        </PanelLayout>
    );
}
