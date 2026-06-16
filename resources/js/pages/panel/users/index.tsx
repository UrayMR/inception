import { Head, usePage } from '@inertiajs/react';
import { CreateButton } from '@/components/buttons/create-button';
import { DataTable } from '@/components/data-table/data-table';
import { MainContent } from '@/components/main-content';
import { getUserColumns } from '@/features/panel/user/column/user-column';
import PanelLayout from '@/layouts/panel-layout';
import users from '@/routes/panel/users';
import type {
    Auth,
    BreadcrumbItem,
    DataTableProps,
    IUserIndex,
    SearchParams,
} from '@/types';

type UsersPageProps = {
    users: DataTableProps<IUserIndex>;
    filters: SearchParams;
    auth: Auth;
};

export default function IndexUsersPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: users.index.url() },
    ];

    const { props } = usePage<UsersPageProps>();

    return (
        <PanelLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <MainContent>
                <MainContent.Header title="Users List" />
                <MainContent.Section>
                    <DataTable<IUserIndex>
                        route={users.index()}
                        columns={getUserColumns(props.users.meta)}
                        data={props.users.data}
                        meta={props.users.meta}
                        links={props.users.links}
                        extraActions={
                            <CreateButton href={users.create.url()} />
                        }
                    />
                </MainContent.Section>
            </MainContent>
        </PanelLayout>
    );
}
