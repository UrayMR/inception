import { Plus, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CompetitionTimeline } from '@/types';
import { DateTimePicker } from './date-time-picker';
import InputError from './input-error';
import InputHint from './input-hint';
import { Label } from './ui/label';

interface DynamicTimelineInputProps {
    id: string;
    label: string;
    value?: CompetitionTimeline[];
    onChange?: (value: CompetitionTimeline[]) => void;
    error?: Record<string, string>;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    hint?: string;
}

export function DynamicTimelineInput({
    id,
    label,
    value = [],
    onChange,
    error,
    required,
    disabled,
    readOnly,
    hint,
}: DynamicTimelineInputProps) {
    const isDisabled = disabled || readOnly;

    const handleAddItem = useCallback(() => {
        const newItem: CompetitionTimeline = {
            timeline_name: '',
            description: '',
            sequence: value.length + 1,
            start_at: new Date(),
            end_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Default to 1 day later
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

    // Specific field change handler to update only the changed field of a timeline item
    const handleFieldChange = useCallback(
        (index: number, field: keyof CompetitionTimeline, newValue: any) => {
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
                    const nameError =
                        error?.[`timelines.${index}.timeline_name`];
                    const sequenceError =
                        error?.[`timelines.${index}.sequence`];
                    const startAtError = error?.[`timelines.${index}.start_at`];
                    const endAtError = error?.[`timelines.${index}.end_at`];

                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col gap-3 rounded-md border bg-background p-3"
                        >
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Timeline #{index + 1}
                                </span>
                                {!isDisabled && value.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveItem(index)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        aria-label="Remove timeline"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Grid Input Fields */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <Label
                                        htmlFor={`${id}-name-${index}`}
                                        className="text-xs"
                                    >
                                        Timeline Name
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id={`${id}-name-${index}`}
                                        value={item.timeline_name}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                index,
                                                'timeline_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Your timeline name"
                                        disabled={isDisabled}
                                    />
                                    {nameError && (
                                        <InputError message={nameError} />
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label
                                        htmlFor={`${id}-seq-${index}`}
                                        className="text-xs"
                                    >
                                        Sequence
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id={`${id}-seq-${index}`}
                                        type="number"
                                        value={item.sequence}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                index,
                                                'sequence',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        disabled={isDisabled}
                                    />
                                    {sequenceError && (
                                        <InputError message={sequenceError} />
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor={`timeline-start-${index}`}
                                        className="text-xs"
                                    >
                                        Start Date & Time
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <DateTimePicker
                                        date={
                                            item.start_at
                                                ? new Date(item.start_at)
                                                : undefined
                                        }
                                        setDate={(newDate) =>
                                            handleFieldChange(
                                                index,
                                                'start_at',
                                                newDate,
                                            )
                                        }
                                        disabled={isDisabled}
                                    />
                                    {startAtError && (
                                        <InputError message={startAtError} />
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor={`timeline-end-${index}`}
                                        className="text-xs"
                                    >
                                        End Date & Time
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <DateTimePicker
                                        date={
                                            item.end_at
                                                ? new Date(item.end_at)
                                                : undefined
                                        }
                                        setDate={(newDate) =>
                                            handleFieldChange(
                                                index,
                                                'end_at',
                                                newDate,
                                            )
                                        }
                                        disabled={isDisabled}
                                    />
                                    {endAtError && (
                                        <InputError message={endAtError} />
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 md:col-span-3">
                                    <Label
                                        htmlFor={`${id}-desc-${index}`}
                                        className="text-xs"
                                    >
                                        Description (Optional)
                                    </Label>
                                    <Input
                                        id={`${id}-desc-${index}`}
                                        value={item.description || ''}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                index,
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Short description about the timeline"
                                        disabled={isDisabled}
                                    />
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
                    <Plus className="mr-2 h-4 w-4" /> Add Timeline Item
                </Button>
            )}
        </div>
    );
}
