import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
    date?: Date;
    setDate: (date: Date) => void;
    disabled?: boolean;
}

export function DateTimePicker({
    date,
    setDate,
    disabled,
}: DateTimePickerProps) {
    const currentDate = date ? new Date(date) : new Date();

    const handleSelectDate = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            return;
        }

        selectedDate.setHours(currentDate.getHours());
        selectedDate.setMinutes(currentDate.getMinutes());
        setDate(selectedDate);
    };

    const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
        const numValue = parseInt(value, 10) || 0;
        const newDate = new Date(currentDate);

        if (type === 'hours') {
            newDate.setHours(Math.min(23, Math.max(0, numValue)));
        } else {
            newDate.setMinutes(Math.min(59, Math.max(0, numValue)));
        }

        setDate(newDate);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, 'PPP HH:mm')
                    ) : (
                        <span>Pick date & time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col p-0" align="start">
                <Calendar
                    mode="single"
                    selected={currentDate}
                    captionLayout="dropdown-months"
                    onSelect={handleSelectDate}
                />

                <div className="flex items-center justify-between gap-2 border-t bg-muted/20 p-3">
                    <span className="text-xs font-medium text-muted-foreground">
                        Time (24-hour)
                    </span>
                    <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            className="h-8 w-14 p-1 text-center"
                            min={0}
                            max={23}
                            value={String(currentDate.getHours()).padStart(
                                2,
                                '0',
                            )}
                            onChange={(e) =>
                                handleTimeChange('hours', e.target.value)
                            }
                            disabled={disabled}
                        />
                        <span className="font-bold">:</span>
                        <Input
                            type="number"
                            className="h-8 w-14 p-1 text-center"
                            min={0}
                            max={59}
                            value={String(currentDate.getMinutes()).padStart(
                                2,
                                '0',
                            )}
                            onChange={(e) =>
                                handleTimeChange('minutes', e.target.value)
                            }
                            disabled={disabled}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
