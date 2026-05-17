export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './data-table';
export type * from './form';

export * from './enums/role';
export type * from './enums/role';

export * from './enums/competition';
export type * from './enums/competition';

export type * from './entities/user';
export type * from './entities/competition';

export interface SearchParams {
    search?: string;
    filterKey?: string;
    filterValue?: string | number | null;
}

export interface Option {
    label: string;
    value: string;
}
