import type { Option } from '.';

export type FormMode = 'create' | 'edit' | 'show';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type FormProps<T> = {
    mode: FormMode;
    data: T;
    errors: FormErrors<T>;
    onChange: <K extends keyof T>(key: K, value: T[K]) => void;
    options?: Record<string, Option[]>;
};
