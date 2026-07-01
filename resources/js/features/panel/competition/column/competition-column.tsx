import type { ColumnDef } from '@tanstack/react-table';
import { DeleteDialogButton } from '@/components/buttons/delete-dialog-button';
import { EditButton } from '@/components/buttons/edit-button';
import { ShowButton } from '@/components/buttons/show-button';
import competitions from '@/routes/panel/competitions';
import type { ICompetitionIndex, PaginationMeta } from '@/types';

export const getCompetitionColumns = (
    meta: PaginationMeta,
): ColumnDef<ICompetitionIndex>[] => [
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
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.original.type;

            return type.charAt(0).toUpperCase() + type.slice(1);
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            return status.charAt(0).toUpperCase() + status.slice(1);
        },
    },
    {
        header: 'Actions',
        cell: ({ row }) => {
            const slug = row.original.slug;

            return (
                <div className="flex items-center gap-2">
                    <ShowButton
                        href={competitions.show.url({
                            competition: slug,
                        })}
                    />

                    <EditButton
                        href={competitions.edit.url({
                            competition: slug,
                        })}
                    />

                    <DeleteDialogButton
                        href={competitions.destroy.url({
                            competition: slug,
                        })}
                    />
                </div>
            );
        },
    },
];
