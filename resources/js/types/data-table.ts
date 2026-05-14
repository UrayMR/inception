export interface DataTableMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }>;
}

export interface DataTableLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface DataTableProps<T> {
    data: T[];
    meta: DataTableMeta;
    links: DataTableLinks;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
}
