import { DateTimePicker } from '@/components/date-time-picker';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AssignmentStatusType, FormProps, Option } from '@/types';
import { AssignmentStatusMap } from '@/types';

type AssignmentFormData = {
    competition_id: string;
    name: string;
    assignment_guide_link: string;
    status: AssignmentStatusType;
    due_at: Date;
    competition?: Option;
};

type AssignmentFormProps = FormProps<AssignmentFormData> & {
    competitions?: Option[];
};

export default function AssignmentForm({
    mode,
    data,
    errors,
    onChange,
    competitions,
}: AssignmentFormProps) {
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    const competitionMap = competitions || [];

    const selectedCompetition = competitionMap.find(
        (competition) => competition.value === data.competition_id,
    );

    const displayValue = showMode
        ? data.competition?.label
        : selectedCompetition?.label;

    const handleCompetitionChange = (value: string) => {
        onChange('competition_id', value);
    };

    const handleFieldChange = (value: Date) => {
        onChange('due_at', value);
    };

    return (
        <div className="space-y-5">
            <FormField
                name="competition_id"
                label="Competition"
                error={errors.competition_id}
                required
            >
                <Select
                    value={data.competition_id}
                    onValueChange={handleCompetitionChange}
                    disabled={isReadOnly}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Competition">
                            {displayValue}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(competitionMap).map((competition) => (
                            <SelectItem
                                key={competition.value}
                                value={competition.value}
                                disabled={isReadOnly}
                            >
                                {competition.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField
                name="name"
                label="Assignment Name"
                error={errors.name}
                required
            >
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Assignment Name"
                    required
                />
            </FormField>

            <FormField
                name="assignment_guide_link"
                label="Assignment Guide Link"
                error={errors.assignment_guide_link}
                required
            >
                <Input
                    id="assignment_guide_link"
                    type="text"
                    value={data.assignment_guide_link}
                    onChange={(e) =>
                        onChange('assignment_guide_link', e.target.value)
                    }
                    readOnly={isReadOnly}
                    placeholder="Enter Assignment Guide Link"
                    required
                />
            </FormField>

            <FormField
                name="due_at"
                label="Due At"
                error={errors.due_at}
                required
            >
                <DateTimePicker
                    date={data.due_at ? new Date(data.due_at) : undefined}
                    setDate={handleFieldChange}
                    disabled={isReadOnly}
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
                        onChange('status', value as AssignmentStatusType)
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(AssignmentStatusMap).map((status) => (
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
        </div>
    );
}
