import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FormProps, Option, TeamMember } from '@/types';
import { CompetitionTypeMap } from '@/types';
import { DynamicTeamInput } from '../specifics/dynamic-team-input';

type TeamFormData = {
    competition_id: string;
    team_name: string;
    leader_name?: string;
    phone_number: string;

    members?: TeamMember[];
    competition?: Option;
};

type TeamFormProps = FormProps<TeamFormData> & {
    competitions?: Option[];
};

export function TeamForm({
    mode,
    data,
    errors,
    onChange,
    competitions,
}: TeamFormProps) {
    const createMode = mode === 'create';
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    const competitionMap = competitions || [];

    const selectedCompetition = competitionMap.find(
        (competition) => competition.value === data.competition_id,
    );

    const isSoloCompetition = showMode
        ? data.competition?.otherValues?.type === CompetitionTypeMap.Solo.value
        : selectedCompetition?.otherValues?.type ===
          CompetitionTypeMap.Solo.value;

    const displayValue = showMode
        ? data.competition?.label
        : selectedCompetition?.label;

    const handleCompetitionChange = (value: string) => {
        onChange('competition_id', value);

        const newSelectedCompetition = competitionMap.find(
            (competition) => competition.value === value,
        );

        // If the newly selected competition is a solo type, clear the members array
        if (
            newSelectedCompetition?.otherValues?.type ===
            CompetitionTypeMap.Solo.value
        ) {
            onChange('members', []);
        } else if (
            newSelectedCompetition?.otherValues?.type ===
            CompetitionTypeMap.Team.value
        ) {
            if (!data.members || data.members.length === 0) {
                onChange('members', [{ member_name: '' }]);
            }
        }
    };

    return (
        <div className="space-y-5">
            <FormField
                name="team_name"
                label="Team Name"
                error={errors.team_name}
                required
            >
                <Input
                    id="team_name"
                    type="text"
                    value={data.team_name}
                    onChange={(e) => onChange('team_name', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Team Name"
                    required
                />
            </FormField>

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

            {!createMode && (
                <FormField name="leader_name" label="Leader Name" required>
                    <Input
                        id="leader_name"
                        type="text"
                        value={data.leader_name || 'empty'}
                        placeholder="Enter Leader Name"
                        readOnly
                        required
                    />
                </FormField>
            )}

            <FormField
                name="phone_number"
                label="Phone Number"
                error={errors.phone_number}
                required
            >
                <Input
                    id="phone_number"
                    type="text"
                    value={data.phone_number}
                    onChange={(e) => onChange('phone_number', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Phone Number"
                    required
                />
            </FormField>

            {!isSoloCompetition && (
                <div>
                    <hr className="my-6 border-muted" />

                    <div className="space-y-4">
                        <DynamicTeamInput
                            id="members"
                            label="Team Members"
                            hint="Manage team members for this competition."
                            value={data.members || []}
                            onChange={(updatedMembers) =>
                                onChange('members', updatedMembers)
                            }
                            error={errors}
                            disabled={isReadOnly || isSoloCompetition}
                            required={!isSoloCompetition}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
