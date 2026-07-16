import type { ColumnDef } from '@tanstack/react-table';
import { DeleteDialogButton } from '@/components/buttons/delete-dialog-button';
import { EditButton } from '@/components/buttons/edit-button';
import { ShowButton } from '@/components/buttons/show-button';
import assignments from '@/routes/panel/assignments';
import type { IAssignmentIndex, PaginationMeta } from '@/types';

export const getAssignmentColumns = (
    meta: PaginationMeta,
): ColumnDef<IAssignmentIndex>[] => [
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
        accessorKey: 'competition',
        header: 'Competition',
        cell: ({ row }) => {
            const competition = row.original.competition;

            return competition.label;
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
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
            const id = row.original.id;

            return (
                <div className="flex items-center gap-2">
                    <ShowButton
                        href={assignments.show.url({
                            assignment: id,
                        })}
                    />

                    <EditButton
                        href={assignments.edit.url({
                            assignment: id,
                        })}
                    />

                    <DeleteDialogButton
                        href={assignments.destroy.url({
                            assignment: id,
                        })}
                    />
                </div>
            );
        },
    },
];
