import { Plus, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import InputError from '@/components/input-error';
import InputHint from '@/components/input-hint';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TeamMember } from '@/types';

interface DynamicTeamInputProps {
    id: string;
    label: string;
    value?: TeamMember[];
    onChange?: (value: TeamMember[]) => void;
    error?: Partial<Record<string, string>>;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    hint?: string;
    minItems?: number;
    maxItems?: number;
}

export function DynamicTeamInput({
    id,
    label,
    value = [],
    onChange,
    error,
    required,
    disabled,
    readOnly,
    hint,
    minItems = 1,
    maxItems,
}: DynamicTeamInputProps) {
    const isDisabled = disabled || readOnly;
    const canAddMore =
        !isDisabled &&
        (typeof maxItems !== 'number' || value.length < maxItems);

    const handleAddItem = useCallback(() => {
        if (!canAddMore) {
            return;
        }

        const newItem: TeamMember = {
            member_name: '',
        };
        onChange?.([...value, newItem]);
    }, [canAddMore, onChange, value]);

    const handleRemoveItem = useCallback(
        (index: number) => {
            const newItems = value.filter((_, i) => i !== index);
            onChange?.(newItems);
        },
        [onChange, value],
    );

    const handleFieldChange = useCallback(
        (index: number, field: keyof TeamMember, newValue: any) => {
            const newItems = value.map((item, i) => {
                if (i === index) {
                    return { ...item, [field]: newValue };
                }

                return item;
            });
            onChange?.(newItems);
        },
        [onChange, value],
    );

    return (
        <div className="flex flex-col space-y-5 rounded-lg border border-purple-500/20 bg-transparent p-5">
            {/* Header Section */}
            <div className="space-y-1">
                <Label className="text-base font-semibold">
                    {label}{' '}
                    {required && <span className="text-destructive">*</span>}
                </Label>
                {hint && <InputHint hint={hint} />}
            </div>

            {/* List Members */}
            <div className="flex flex-col space-y-4">
                {value.map((item, index) => {
                    const memberNameError =
                        error?.[`members.${index}.member_name`];

                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col space-y-4 rounded-md border border-muted/20 bg-transparent p-4 transition-colors hover:border-muted/40"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-muted/10 pb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Member #{index + 1}
                                </span>
                                {!isDisabled && value.length > minItems && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="absolute top-2 right-0 h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/10 hover:text-destructive"
                                        aria-label="Remove member"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Input Field Area */}
                            <div className="flex flex-col space-y-1.5">
                                <Label
                                    htmlFor={`${id}-member-name-${index}`}
                                    className="text-xs font-medium"
                                >
                                    Member Name
                                    <span className="ml-1 text-destructive">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id={`${id}-member-name-${index}`}
                                    value={item.member_name}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            index,
                                            'member_name',
                                            e.target.value,
                                        )
                                    }
                                    className="border-purple-500/20 focus-visible:border-purple-500/40 focus-visible:ring-purple-500/20"
                                    placeholder="Your member name"
                                    disabled={isDisabled}
                                />
                                {memberNameError && (
                                    <InputError message={memberNameError} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Status & Action */}
            <div className="flex flex-col space-y-2">
                <p className="text-xs text-muted-foreground">
                    {value.length}
                    {typeof maxItems === 'number' ? `/${maxItems}` : ''} members
                    added
                </p>

                {!isDisabled && (
                    <button
                        type="button"
                        className="w-full rounded-md border border-purple-500/20 bg-transparent py-2.5 text-center text-sm font-medium text-purple-500 transition-colors hover:bg-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleAddItem}
                        disabled={!canAddMore}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" /> Add Member
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
