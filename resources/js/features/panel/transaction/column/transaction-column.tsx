import type { ColumnDef } from '@tanstack/react-table';
import { ShowButton } from '@/components/buttons/show-button';
import transactions from '@/routes/panel/transactions';
import type { ITransactionIndex, PaginationMeta } from '@/types';

export const getTransactionColumns = (
    meta: PaginationMeta,
): ColumnDef<ITransactionIndex>[] => [
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
        accessorKey: 'team_name',
        header: 'Team Name',
    },
    {
        accessorKey: 'competition_name',
        header: 'Competition Name',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = row.original.amount;

            return `Rp. ${amount.toLocaleString('id-ID')}`;
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
            return (
                <div className="flex items-center gap-2">
                    <ShowButton
                        href={transactions.show.url({
                            transaction: row.original,
                        })}
                    />
                </div>
            );
        },
    },
];
