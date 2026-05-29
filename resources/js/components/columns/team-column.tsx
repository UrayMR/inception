import type { ColumnDef } from '@tanstack/react-table';
import teams from '@/routes/panel/teams';
import type { ITeamIndex, PaginationMeta } from '@/types';
import { DeleteDialogButton } from '../buttons/delete-dialog-button';
import { EditButton } from '../buttons/edit-button';
import { ShowButton } from '../buttons/show-button';

export const getTeamColumns = (
    meta: PaginationMeta,
): ColumnDef<ITeamIndex>[] => [
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
        accessorKey: 'competition.label',
        header: 'Competition Name',
    },
    {
        accessorKey: 'team_name',
        header: 'Team Name',
    },
    {
        accessorKey: 'leader_name',
        header: 'Leader Name',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            return status.charAt(0).toUpperCase() + status.slice(1);
        }
    },
    {
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <ShowButton
                        href={teams.show.url({
                            team: row.original.id,
                        })}
                    />

                    <EditButton
                        href={teams.edit.url({
                            team: row.original.id,
                        })}
                    />

                    <DeleteDialogButton
                        href={teams.destroy.url({
                            team: row.original.id,
                        })}
                    />
                </div>
            );
        },
    },
];
