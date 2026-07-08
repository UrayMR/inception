import { FormField } from '@/components/form-field';
import { ImageUploadField } from '@/components/image-upload-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DynamicTimelineInput } from '@/features/panel/competition/components/dynamic-timeline-input';
import type {
    CompetitionStatusType,
    CompetitionTimeline,
    CompetitionType,
    FormProps,
} from '@/types';
import { CompetitionStatusMap, CompetitionTypeMap } from '@/types';

type CompetitionFormData = {
    name: string;
    description?: string | null;
    type: CompetitionType;
    image_file?: File | null;
    image_path?: string | null;
    price: number;
    max_member?: number;
    status: CompetitionStatusType;
    timelines: CompetitionTimeline[];
};

type CompetitionFormProps = FormProps<CompetitionFormData> & {
    imagePath?: string | null;
};

export function CompetitionForm({
    mode,
    data,
    errors,
    onChange,
    imagePath,
}: CompetitionFormProps) {
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    const isTeamType = data.type === CompetitionTypeMap.Team.value;
    const fallbackMaxMember = isTeamType ? 2 : 1;

    const handleTypeChange = (value: CompetitionType) => {
        onChange('type', value);

        if (value === CompetitionTypeMap.Solo.value) {
            onChange('max_member', 1);

            return;
        }

        if (
            value === CompetitionTypeMap.Team.value &&
            (!data.max_member || data.max_member < 2)
        ) {
            onChange('max_member', 2);
        }
    };

    return (
        <div className="space-y-5">
            <FormField
                name="image_file"
                label="Competition Image"
                error={errors.image_file}
                required={false}
            >
                <ImageUploadField
                    value={data.image_file || imagePath || null}
                    onChange={(file) => onChange('image_file', file as File)}
                    disabled={isReadOnly}
                />
            </FormField>

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
                        handleTypeChange(value as CompetitionType)
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
                    min={0}
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
                name="max_member"
                label="Max Members"
                error={errors.max_member}
                required={isTeamType}
            >
                <Input
                    id="max_member"
                    type="number"
                    min={isTeamType ? 2 : 1}
                    value={data.max_member ?? ''}
                    onChange={(e) =>
                        onChange(
                            'max_member',
                            e.target.value
                                ? parseInt(e.target.value)
                                : fallbackMaxMember,
                        )
                    }
                    readOnly={isReadOnly || !isTeamType}
                    placeholder="Enter maximum team members"
                    required={isTeamType}
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
