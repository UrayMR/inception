export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './data-table';
export type * from './form';
export type * from './entities/user';
export * from './enums/role';

export interface SearchParams {
    search?: string;
    filterKey?: string;
    filterValue?: string | number | null;
}

export interface Option {
    label: string;
    value: string;
}
