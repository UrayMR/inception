import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import type { DataTableLinks, DataTableMeta } from '@/types';

type DataTablePaginationProps = {
    meta: DataTableMeta;
    links: DataTableLinks;
    pageCount: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

export function DataTablePagination({
    meta,
    links,
    pageCount,
    isLoading,
    onPageChange,
}: DataTablePaginationProps) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        className={cn(
                            !links.prev || isLoading
                                ? 'hidden'
                                : 'cursor-pointer',
                        )}
                        onClick={() => onPageChange(meta.current_page - 1)}
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
                        onClick={() => onPageChange(meta.current_page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
