import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { UserForm } from '@/components/forms/user-form';
import { MainContent } from '@/components/main-content';
import PanelLayout from '@/layouts/panel-layout';
import users from '@/routes/users';
import type { BreadcrumbItem, IUserShow } from '@/types';
import type { UserRoleValue } from '@/types';

interface ShowUserForm {
    name: string;
    email: string;
    role: UserRoleValue;
    updated_at: string;
    created_at: string;
}

interface ShowUserPageProps {
    user: IUserShow;
}

export default function ShowUserPage({ user }: ShowUserPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: users.index.url() },
        { title: 'User Detail', href: users.show.url(user.id) },
    ];

    const data: ShowUserForm = {
        name: user.name,
        email: user.email,
        role: user.role,
        updated_at: user.updated_at,
        created_at: user.created_at,
    };

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="User Detail" />
            <MainContent>
                <MainContent.Header
                    title="User Detail"
                    actions={<BackButton href={users.index.url()} />}
                />
                <MainContent.Section>
                    <UserForm
                        mode="show"
                        data={data}
                        errors={{}}
                        onChange={() => {}}
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
