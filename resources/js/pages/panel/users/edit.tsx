import { Head, useForm } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { SubmitButton } from '@/components/buttons/submit-button';
import { UserForm } from '@/components/forms/user-form';
import { MainContent } from '@/components/main-content';
import { useZod } from '@/hooks/use-zod';
import PanelLayout from '@/layouts/panel-layout';
import users from '@/routes/panel/users';
import type { BreadcrumbItem, IUserEdit } from '@/types';
import { UpdateUserSchema } from '@/validations/user-schema';
import type { UpdateUserSchemaType } from '@/validations/user-schema';

interface EditUserPageProps {
    user: IUserEdit;
}

export default function EditUserPage({ user }: EditUserPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: users.index.url() },
        { title: 'Edit User', href: users.edit.url(user.id) },
    ];

    const form = useForm<UpdateUserSchemaType>({
        name: user.name,
        email: user.email,
        role: user.role,
        password: undefined,
        password_confirmation: undefined,
    });

    const { guard } = useZod<UpdateUserSchemaType>(UpdateUserSchema);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.put(users.update.url(user.id));
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex flex-col gap-4 p-4">
                <MainContent>
                    <MainContent.Header
                        title="Edit User"
                        actions={<BackButton href={users.index.url()} />}
                    />

                    <MainContent.Section>
                        <form onSubmit={handleSubmit}>
                            <UserForm
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
