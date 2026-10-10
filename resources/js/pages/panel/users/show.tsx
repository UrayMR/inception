import { Head } from '@inertiajs/react';
import { BackButton } from '@/components/buttons/back-button';
import { MainContent } from '@/components/main-content';
import { UserForm } from '@/features/panel/user';
import PanelLayout from '@/layouts/panel-layout';
import users from '@/routes/panel/users';
import type { BreadcrumbItem, IUserShow, Option, UserRoleType } from '@/types';

interface ShowUserForm {
    name: string;
    email: string;
    role: UserRoleType;
    competition_id?: string | null;
    competition?: Option | null;
    updated_at: string;
    created_at: string;
}

interface ShowUserPageProps {
    user: IUserShow;
    competitions?: Option[];
}

export default function ShowUserPage({
    user,
    competitions = [],
}: ShowUserPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: users.index.url() },
        { title: 'User Detail', href: users.show.url(user.id) },
    ];
    const competitionOptions = competitions;
    const selectedCompetition =
        competitionOptions.find((item) => item.value === user.competition_id) ??
        user.competition ??
        null;

    const data: ShowUserForm = {
        name: user.name,
        email: user.email,
        role: user.role,
        competition_id:
            user.competition_id ?? selectedCompetition?.value ?? null,
        competition: selectedCompetition,
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
                        competitions={competitionOptions}
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
