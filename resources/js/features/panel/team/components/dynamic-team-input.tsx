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

    // Specific field change handler to update only the changed field of a team member item
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
        <div className="flex flex-col space-y-4 rounded-lg border border-purple-500/20 bg-transparent p-4">
            <div>
                <Label className="text-base font-semibold">
                    {label}{' '}
                    {required && <span className="text-destructive">*</span>}
                </Label>
                {hint && <InputHint hint={hint} />}
            </div>

            <div className="flex flex-col gap-4">
                {value.map((item, index) => {
                    const memberNameError =
                        error?.[`members.${index}.member_name`];

                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col gap-3 rounded-md border border-muted/10 bg-transparent p-3"
                        >
                            <div className="flex items-center justify-between border-b border-muted/10 pb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Member #{index + 1}
                                </span>
                                {!isDisabled && value.length > minItems && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                        aria-label="Remove member"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Grid Input Fields */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <Label
                                        htmlFor={`${id}-member-name-${index}`}
                                        className="text-xs"
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
                                        className="border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                                        placeholder="Your member name"
                                        disabled={isDisabled}
                                    />
                                    {memberNameError && (
                                        <InputError message={memberNameError} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-muted-foreground">
                {value.length}/{maxItems} members added
            </p>

            {!isDisabled && (
                <button
                    type="button"
                    className="w-full rounded-md border border-purple-500/20 bg-transparent px-4 py-2 text-center text-sm font-medium text-purple-500 transition-colors hover:bg-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleAddItem}
                    disabled={!canAddMore}
                >
                    <span className="flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" /> Add Member
                    </span>
                </button>
            )}
        </div>
    );
}
