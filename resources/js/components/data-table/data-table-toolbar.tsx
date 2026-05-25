import { RotateCcw, Search as SearchIcon } from 'lucide-react';
import React from 'react';
import { SearchInput as Search } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { UnifiedFilter } from '@/components/unified-filter';
import type { FiltersParamsType, SearchParamsType } from '@/types';

type FilterOption = {
    key: string;
    label: string;
    values: { label: string; value: string | number }[];
};

type DataTableToolbarProps = {
    search: SearchParamsType;
    filters: FiltersParamsType;
    filtersSchema?: FilterOption[];
    isLoading: boolean;
    onSearchChange: (value: SearchParamsType) => void;
    onFiltersChange: (filters: FiltersParamsType) => void;
    onSubmit: (e: React.SubmitEvent) => void;
    onReset: () => void;
    extraActions?: React.ReactNode;
};

export function DataTableToolbar({
    search,
    filters,
    filtersSchema = [],
    isLoading,
    onSearchChange,
    onFiltersChange,
    onSubmit,
    onReset,
    extraActions,
}: DataTableToolbarProps) {
    const shouldShowReset =
        (!!search && search !== '') ||
        Object.values(filters ?? {}).some((v) => v !== null && v !== '');

    return (
        <div className="flex flex-col justify-between gap-4 md:flex-row">
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-4 md:flex-row"
            >
                <Search
                    value={search ?? ''}
                    onChange={onSearchChange}
                    disabled={isLoading}
                />

                {filtersSchema.length > 0 && (
                    <UnifiedFilter
                        columns={filtersSchema}
                        selectedFilters={filters}
                        onChange={onFiltersChange}
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
                        onClick={onReset}
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
    );
}
