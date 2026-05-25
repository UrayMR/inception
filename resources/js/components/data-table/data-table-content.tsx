import { flexRender } from '@tanstack/react-table';
import type { Table as ReactTableType, ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DataTableContentProps<TData, TValue> = {
    table: ReactTableType<TData>;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
};

export function DataTableContent<TData, TValue>({
    table,
    columns,
    data,
    isLoading,
}: DataTableContentProps<TData, TValue>) {
    return (
        <div className="relative overflow-x-auto rounded-md border">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading data...
                    </div>
                </div>
            )}
            <Table className="table-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {!header.isPlaceholder &&
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="py-6 text-center text-muted-foreground"
                            >
                                No data found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
