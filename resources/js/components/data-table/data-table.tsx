import { router, useForm } from '@inertiajs/react';
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { DataTableContent } from '@/components/data-table/data-table-content';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type {
    DataTableLinks,
    DataTableMeta,
    FiltersParamsType,
    SearchParamsType,
} from '@/types';
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

    return (
        <div className="space-y-4">
            <DataTableToolbar
                search={form.search ?? ''}
                filters={form.filters}
                filtersSchema={filtersSchema}
                isLoading={isLoading}
                onSearchChange={(val: SearchParamsType) =>
                    setData('search', val)
                }
                onFiltersChange={(filters: FiltersParamsType) =>
                    setData('filters', filters)
                }
                onSubmit={handleSubmit}
                onReset={handleReset}
                extraActions={extraActions}
            />

            <DataTableContent
                table={table}
                columns={columns}
                data={data}
                isLoading={isLoading}
            />

            <DataTablePagination
                meta={meta}
                links={links}
                pageCount={pageCount}
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
