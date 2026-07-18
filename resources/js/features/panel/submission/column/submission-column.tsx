import type { ColumnDef } from '@tanstack/react-table';
import type { ISubmissionIndex, PaginationMeta } from '@/types';

export const getSubmissionColumns = (
    meta: PaginationMeta,
): ColumnDef<ISubmissionIndex>[] => [
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
        accessorKey: 'team',
        header: 'Team/Name',
        cell: ({ row }) => {
            const team = row.original.team;

            return team.label;
        },
    },
    {
        accessorKey: 'submission_link',
        header: 'Subnission Link',
    },
];
