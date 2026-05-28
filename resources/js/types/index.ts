export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './data-table';
export type * from './form';

export * from './enums/role';
export type * from './enums/role';

export * from './enums/competition';
export type * from './enums/competition';

export * from './enums/transaction';
export type * from './enums/transaction';

export type * from './entities/user';
export type * from './entities/competition';
export type * from './entities/team';
export type * from './entities/transaction';

export interface SearchParams {
    search?: string;
    filterKey?: string;
    filterValue?: string | number | null;
}

export interface Option {
    value: string;
    label: string;
    otherValues?: Record<string, any>;
}