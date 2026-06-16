import type { ColumnDef } from '@tanstack/react-table';
import { DeleteDialogButton } from '@/components/buttons/delete-dialog-button';
import { EditButton } from '@/components/buttons/edit-button';
import { ShowButton } from '@/components/buttons/show-button';
import users from '@/routes/panel/users';
import type { IUserIndex, PaginationMeta } from '@/types';

export const getUserColumns = (
    meta: PaginationMeta,
): ColumnDef<IUserIndex>[] => [
    {
        accessorKey: 'No',
        header: 'No',
        cell: ({ row }) => {
            const number =
                (meta.current_page - 1) * meta.per_page + (row.index + 1);

            return (
                <div className="flex items-center">
                    <span>{number}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const name = row.original.name;

            return name.length > 20 ? `${name.substring(0, 20)}...` : name;
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.original.role;

            return role.charAt(0).toUpperCase() + role.slice(1);
        },
    },
    {
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <ShowButton
                        href={users.show.url({
                            user: row.original,
                        })}
                    />

                    <EditButton
                        href={users.edit.url({
                            user: row.original,
                        })}
                    />

                    <DeleteDialogButton
                        href={users.destroy.url({
                            user: row.original,
                        })}
                    />
                </div>
            );
        },
    },
];
