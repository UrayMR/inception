import { Plus, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import InputError from '@/components/input-error';
import InputHint from '@/components/input-hint';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TeamMember } from '@/types';

interface DynamicTeamInputProps {
    id: string;
    label: string;
    value?: TeamMember[];
    onChange?: (value: TeamMember[]) => void;
    error?: Record<string, string>;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    hint?: string;
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
}: DynamicTeamInputProps) {
    const isDisabled = disabled || readOnly;

    const handleAddItem = useCallback(() => {
        const newItem: TeamMember = {
            member_name: '',
        };
        onChange?.([...value, newItem]);
    }, [onChange, value]);

    const handleRemoveItem = useCallback(
        (index: number) => {
            const newItems = value
                .filter((_, i) => i !== index)
                .map((item, i) => ({
                    ...item,
                    sequence: i + 1, // Re-index sequence to start from 1
                }));
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
        <div className="flex flex-col space-y-4 rounded-lg border bg-muted/10 p-4">
            <div>
                <Label className="text-base font-semibold">
                    {label}{' '}
                    {required && <span className="text-destructive">*</span>}
                </Label>
                {hint && !error && <InputHint hint={hint} />}
            </div>

            <div className="flex flex-col gap-4">
                {value.map((item, index) => {
                    const memberNameError =
                        error?.[`members.${index}.member_name`];

                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col gap-3 rounded-md border bg-background p-3"
                        >
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Member #{index + 1}
                                </span>
                                {!isDisabled && value.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveItem(index)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        aria-label="Remove member"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
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

            {!isDisabled && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-fit"
                    onClick={handleAddItem}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
            )}
        </div>
    );
}
