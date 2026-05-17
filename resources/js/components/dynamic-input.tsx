import { Plus, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import InputError from './input-error';
import InputHint from './input-hint';
import { Label } from './ui/label';

interface DynamicInputProps {
    id: string;
    label: string;
    value?: string[];
    onChange?: (value: string[]) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    hint?: string;
}

export function DynamicInput({
    id,
    label,
    value = [''],
    onChange,
    placeholder,
    error,
    required,
    disabled,
    readOnly,
    hint,
}: DynamicInputProps) {
    const handleRemove = useCallback(
        (index: number) => {
            if (!value) {
                return;
            }

            const newItems = value
                .filter((_, i) => i !== index)
                .filter((item) => item.trim() !== '');
            onChange?.(newItems);
        },
        [onChange, value],
    );

    const handleChange = useCallback(
        (index: number, newValue: string) => {
            if (!value) {
                return;
            }

            const newItems = value.map((item, i) =>
                i === index ? newValue : item,
            );
            const filtered = newItems.filter((item) => item.trim() !== '');
            onChange?.(filtered.length === 0 ? [] : newItems);
        },
        [onChange, value],
    );

    const addItem = useCallback(() => {
        if (!value || value.length === 0) {
            onChange?.(['']);
        } else {
            const filtered = value.filter((item) => item.trim() !== '');
            onChange?.([...filtered, '']);
        }
    }, [onChange, value]);

    const isDisabled = disabled || readOnly;
    const items = value && value.length > 0 ? value : [''];

    return (
        <div className="flex flex-col space-y-2">
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>

            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="relative flex w-full flex-col gap-0.5"
                    >
                        <div className="flex items-center">
                            <Input
                                id={`${id}-${index}`}
                                value={item}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                                placeholder={`${placeholder || 'Masukkan item'} ${index + 1}`}
                                readOnly={isDisabled}
                                disabled={disabled}
                                aria-label={`${label} ${index + 1}`}
                                autoComplete="off"
                            />
                            {!isDisabled && items.length > 1 && index > 0 && (
                                <Button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className={cn(
                                        // TODO: check styles for this button, maybe we can move it outside of the input and make it always visible instead of only on hover
                                        // 'absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none',
                                        'absolute top-1/2 right-1 -translate-y-1/2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10',
                                        {
                                            'opacity-100': !isDisabled,
                                        },
                                    )}
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!isDisabled && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={addItem}
                    aria-label="Add item"
                >
                    <Plus className="mr-1 h-4 w-4" />
                </Button>
            )}

            <div className="space-y-0.5">
                {hint && !error && <InputHint hint={hint} />}
                {error && <InputError message={error} />}
            </div>
        </div>
    );
}
