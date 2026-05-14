import { router, useForm } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { Loader2, RotateCcw, Search as SearchIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { SearchInput as Search } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UnifiedFilter } from '@/components/unified-filter';
import { cn } from '@/lib/utils';
import type { DataTableLinks, DataTableMeta } from '@/types';
import type { RouteDefinition } from '@/wayfinder';

type FilterOption = {
    key: string;
    label: string;
    values: { label: string; value: string | number }[];
};

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

type DataTableProps<TData, TValue> = {
    route: RouteDefinition<Method>;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta: DataTableMeta;
    links: DataTableLinks;
    filtersSchema?: FilterOption[];
    extraActions?: React.ReactNode;
};

export function DataTable<TData, TValue = unknown>({
    route,
    columns,
    data,
    meta,
    links,
    filtersSchema = [],
    extraActions,
}: DataTableProps<TData, TValue>) {
    const pageCount = useMemo(
        () => Math.max(1, Math.ceil(meta.total / meta.per_page)),
        [meta.total, meta.per_page],
    );
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data: form, setData } = useForm({
        search: '',
        filters: {} as Record<string, string | number | null>,
        page: meta.current_page,
    });

    // Sync URL params with form on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const filters: Record<string, string | number | null> = {};
        urlParams.forEach((value, key) => {
            const match = key.match(/^filters\[(.+)\]$/);

            if (match) {
                filters[match[1]] = value;
            }
        });

        if (
            (searchParam && searchParam.length) ||
            Object.keys(filters).length > 0
        ) {
            setData((prev) => ({
                ...prev,
                search: searchParam ?? '',
                filters,
            }));
        }
    }, [setData]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount,
    });

    // Centralized navigation (pagination, search, reset)
    const navigate = (query: typeof form) => {
        setIsLoading(true);
        router.get(route.url, query, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handlePageChange = (page: number) => navigate({ ...form, page });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ ...form, page: 1 });
    };
    const handleReset = () => {
        const reset = { search: '', filters: {}, page: 1 };
        setData(reset);
        navigate(reset);
    };

    const shouldShowReset =
        (!!form.search && form.search !== '') ||
        Object.values(form.filters ?? {}).some((v) => v !== null && v !== '');

    // Calculate item range (not used currently)
    // const startItem = (meta.current_page - 1) * meta.per_page + 1;
    // const endItem = Math.min(meta.current_page * meta.per_page, meta.total);

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 md:flex-row"
                >
                    <Search
                        value={form.search ?? ''}
                        onChange={(val) => setData('search', val)}
                        disabled={isLoading}
                    />
                    {filtersSchema.length > 0 && (
                        <UnifiedFilter
                            columns={filtersSchema}
                            selectedFilters={form.filters}
                            onChange={(filters) => setData('filters', filters)}
                            disabled={isLoading}
                        />
                    )}
                    <Button type="submit" disabled={isLoading}>
                        <SearchIcon />
                        Search
                    </Button>
                    {shouldShowReset && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </form>
                {extraActions && (
                    <div className="flex justify-end">{extraActions}</div>
                )}
            </div>

            {/* Table */}
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

            {/* Pagination using links */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={cn(
                                !links.prev || isLoading
                                    ? 'hidden'
                                    : 'cursor-pointer',
                            )}
                            onClick={() =>
                                handlePageChange(meta.current_page - 1)
                            }
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="px-2 text-sm text-muted-foreground">
                            {pageCount === 1
                                ? ``
                                : `Page ${meta.current_page} of ${pageCount}`}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            className={cn(
                                !links.next || isLoading
                                    ? 'hidden'
                                    : 'cursor-pointer',
                            )}
                            onClick={() =>
                                handlePageChange(meta.current_page + 1)
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
