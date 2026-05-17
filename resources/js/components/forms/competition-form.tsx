import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    CompetitionStatusType,
    CompetitionTimeline,
    CompetitionType,
    FormProps,
} from '@/types';
import { CompetitionStatusMap, CompetitionTypeMap } from '@/types';
import { DynamicTimelineInput } from '../dynamic-timeline-input';

type CompetitionFormData = {
    name: string;
    description?: string | null;
    type: CompetitionType;
    image_file?: File | null;
    image_path?: string | null;
    price: number;
    status: CompetitionStatusType;
    timelines: CompetitionTimeline[];
};

type CompetitionFormProps = FormProps<CompetitionFormData>;

export function CompetitionForm({
    mode,
    data,
    errors,
    onChange,
}: CompetitionFormProps) {
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    return (
        <div className="space-y-5">
            <FormField
                name="name"
                label="Competition Name"
                error={errors.name}
                required
            >
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Competition Name"
                    required
                />
            </FormField>

            <FormField
                name="description"
                label="Description"
                error={errors.description}
                required={false}
            >
                <Input
                    id="description"
                    type="text"
                    value={data.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Description"
                    autoComplete="description"
                    required={false}
                />
            </FormField>

            <FormField name="type" label="Type" error={errors.type} required>
                <Select
                    value={data.type}
                    onValueChange={(value) =>
                        onChange('type', value as CompetitionType)
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(CompetitionTypeMap).map((type) => (
                            <SelectItem
                                key={type.value}
                                value={type.value}
                                disabled={isReadOnly}
                            >
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField name="price" label="Price" error={errors.price} required>
                <Input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(e) =>
                        onChange('price', parseFloat(e.target.value))
                    }
                    readOnly={isReadOnly}
                    placeholder="Enter Price"
                    required
                />
            </FormField>

            <FormField
                name="status"
                label="Status"
                error={errors.status}
                required
            >
                <Select
                    value={data.status}
                    onValueChange={(value) =>
                        onChange('status', value as CompetitionStatusType)
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(CompetitionStatusMap).map((status) => (
                            <SelectItem
                                key={status.value}
                                value={status.value}
                                disabled={isReadOnly}
                            >
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <hr className="my-6 border-muted" />

            <div className="space-y-4">
                <DynamicTimelineInput
                    id="timelines"
                    label="Competition Timelines"
                    hint="Manage schedule and phases for this competition."
                    value={data.timelines}
                    onChange={(updatedTimelines) =>
                        onChange('timelines', updatedTimelines)
                    }
                    error={errors}
                    disabled={isReadOnly}
                    required
                />
            </div>
        </div>
    );
}
