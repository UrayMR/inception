import { Check, Filter } from 'lucide-react';
import { useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';

import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

export type FilterOption = {
    label: string;
    value: string | number;
};

export type FilterColumn = {
    key: string;
    label: string;
    values: FilterOption[];
};

type UnifiedFilterProps = {
    columns: FilterColumn[];
    selectedFilters: Record<string, string | number | null>;
    onChange: (filters: Record<string, string | number | null>) => void;
    disabled?: boolean;
};

export function UnifiedFilter({
    columns,
    selectedFilters,
    onChange,
    disabled = false,
}: UnifiedFilterProps) {
    const [open, setOpen] = useState(false);

    const flatSelected = Object.entries(selectedFilters)
        .map(([key, val]) => {
            const column = columns.find((c) => c.key === key);
            const option = column?.values.find((v) => v.value === val);

            return option ? `${column?.label}: ${option.label}` : null;
        })
        .filter(Boolean)
        .join(', ');

    const handleSelect = (key: string, value: string | number) => {
        const isAlreadySelected = selectedFilters[key] === value;
        const updated = {
            ...selectedFilters,
            [key]: isAlreadySelected ? null : value,
        };
        onChange(updated);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <div className="relative max-h-9 w-full">
                    <Input
                        readOnly
                        value={flatSelected || ''}
                        placeholder="Pilih Filter"
                        onClick={() => !disabled && setOpen(!open)}
                        title={flatSelected || 'Pilih Filter'}
                        className={cn(
                            'cursor-pointer truncate pr-10',
                            !flatSelected
                                ? 'font-thin text-muted-foreground'
                                : 'font-normal',
                        )}
                        disabled={disabled}
                    />

                    {!disabled && (
                        <Filter className="pointer-events-none absolute top-0.5 right-3 h-4 w-4 translate-y-1/2 text-muted-foreground opacity-50" />
                    )}
                </div>
            </PopoverTrigger>

            {!disabled && (
                <PopoverContent
                    className="max-w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    sideOffset={4}
                >
                    <Command>
                        <CommandInput placeholder="Cari Filter..." autoFocus />
                        <CommandEmpty>
                            Tidak ada filter yang ditemukan.
                        </CommandEmpty>
                        <div className="max-h-60 overflow-y-auto">
                            {columns.map((col) => (
                                <CommandGroup key={col.key} heading={col.label}>
                                    {col.values.map((opt) => (
                                        <CommandItem
                                            key={`${col.key}:${opt.value}`}
                                            onSelect={() =>
                                                handleSelect(col.key, opt.value)
                                            }
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    selectedFilters[col.key] ===
                                                        opt.value
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                            {opt.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </div>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    );
}
