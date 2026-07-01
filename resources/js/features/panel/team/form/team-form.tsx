import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DynamicTeamInput } from '@/features/panel/team/components/dynamic-team-input';
import type { FormProps, Option, TeamMember, TeamStatusType } from '@/types';
import { CompetitionTypeMap, TeamStatusMap } from '@/types';

type TeamFormData = {
    competition_id: string;
    team_name: string;
    institution?: string;
    phone_number: string;
    status: TeamStatusType;
    members?: TeamMember[];
    competition?: Option;
};

type TeamFormProps = FormProps<TeamFormData> & {
    competitions?: Option[];
    leaderName?: string;
};

export function TeamForm({
    mode,
    data,
    errors,
    onChange,
    competitions,
    leaderName,
}: TeamFormProps) {
    const createMode = mode === 'create';
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    const competitionMap = competitions || [];

    const selectedCompetition = competitionMap.find(
        (competition) => competition.value === data.competition_id,
    );

    const selectedCompetitionType = showMode
        ? data.competition?.otherValues?.type
        : selectedCompetition?.otherValues?.type;

    const isTeamCompetition =
        selectedCompetitionType === CompetitionTypeMap.Team.value;

    const selectedCompetitionMaxMember = Number(
        (showMode
            ? data.competition?.otherValues?.max_member
            : selectedCompetition?.otherValues?.max_member) ?? 0,
    );

    const maxAdditionalMembers =
        isTeamCompetition && selectedCompetitionMaxMember >= 2
            ? selectedCompetitionMaxMember - 1
            : undefined;

    const displayValue = showMode
        ? data.competition?.label
        : selectedCompetition?.label;

    const handleCompetitionChange = (value: string) => {
        onChange('competition_id', value);

        const newSelectedCompetition = competitionMap.find(
            (competition) => competition.value === value,
        );
        const competitionType = newSelectedCompetition?.otherValues?.type;
        const competitionMaxMember = Number(
            newSelectedCompetition?.otherValues?.max_member ?? 0,
        );
        const maxMembersForPayload =
            competitionType === CompetitionTypeMap.Team.value &&
            competitionMaxMember >= 2
                ? competitionMaxMember - 1
                : 0;

        // If the newly selected competition is a solo type, clear the members array
        if (competitionType === CompetitionTypeMap.Solo.value) {
            onChange('members', []);
        } else if (competitionType === CompetitionTypeMap.Team.value) {
            const trimmedMembers = (data.members || []).slice(
                0,
                maxMembersForPayload,
            );

            if (trimmedMembers.length === 0 && maxMembersForPayload > 0) {
                onChange('members', [{ member_name: '' }]);

                return;
            }

            onChange('members', trimmedMembers);
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
                name="institution"
                label="Institution"
                error={errors.institution}
                required={false}
            >
                <Input
                    id="institution"
                    type="text"
                    value={data.institution || ''}
                    onChange={(e) => onChange('institution', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Institution"
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
                        onChange('status', value as TeamStatusType)
                    }
                    disabled={isReadOnly}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(TeamStatusMap).map((status) => (
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
                        value={leaderName || 'empty'}
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

            {isTeamCompetition && (
                <div>
                    <hr className="my-6 border-muted" />

                    <div className="space-y-4">
                        <DynamicTeamInput
                            id="members"
                            label="Team Members"
                            hint={
                                maxAdditionalMembers
                                    ? `Add up to ${maxAdditionalMembers} team members (leader is counted separately).`
                                    : 'Manage team members for this competition.'
                            }
                            value={data.members || []}
                            onChange={(updatedMembers) =>
                                onChange(
                                    'members',
                                    maxAdditionalMembers
                                        ? updatedMembers.slice(
                                              0,
                                              maxAdditionalMembers,
                                          )
                                        : updatedMembers,
                                )
                            }
                            error={errors}
                            disabled={isReadOnly}
                            required
                            maxItems={maxAdditionalMembers}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
