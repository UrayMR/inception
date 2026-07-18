import { usePage } from '@inertiajs/react';
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
import type { FormErrors, Option } from '@/types';
import type { RegisterCompetitionFormDataType } from '@/validations/register-competition-schema';
import StepCard from './step-card';

type RegisterCompetitionInfoStepProps = {
    competitionMap: Option[];
    data: RegisterCompetitionFormDataType;
    errors: FormErrors<RegisterCompetitionFormDataType>;
    isTeamCompetition: boolean;
    canFillTeamDetails: boolean;
    selectedCompetition?: Option & {
        otherValues?: {
            max_member?: string;
        };
    };
    onCompetitionChange: (competitionId: string) => void;
    onChange: <K extends keyof RegisterCompetitionFormDataType>(
        key: K,
        value: RegisterCompetitionFormDataType[K],
    ) => void;
};

export default function RegisterCompetitionInfoStep({
    competitionMap,
    data,
    errors,
    isTeamCompetition,
    canFillTeamDetails,
    selectedCompetition,
    onCompetitionChange,
    onChange,
}: RegisterCompetitionInfoStepProps) {
    const auth = usePage().props.auth;

    const leaderNameLabel = isTeamCompetition ? 'Leader Name' : 'Your Name';
    const leaderEmailLabel = isTeamCompetition ? 'Leader Email' : 'Your Email';
    const maxAdditionalMembers =
        isTeamCompetition &&
        Number(selectedCompetition?.otherValues?.max_member) >= 2
            ? Number(selectedCompetition?.otherValues?.max_member) - 1
            : undefined;

    return (
        <StepCard>
            <div className="space-y-1 border-b border-zinc-800 pb-4">
                <h2 className="font-sans text-xl font-black text-white uppercase">
                    Team Information
                </h2>
                <p className="font-mono text-xs text-zinc-500">
                    Please fill in the team details and make sure all the data
                    is correct before proceeding to the next step.
                </p>
            </div>

            <div className="space-y-1.5">
                <FormField
                    name="competition_id"
                    label="Competition"
                    error={errors.competition_id}
                    required
                >
                    <Select
                        value={data.competition_id}
                        onValueChange={onCompetitionChange}
                        required
                    >
                        <SelectTrigger
                            id="competition_id"
                            className="w-full border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                        >
                            <SelectValue placeholder="Select a competition first" />
                        </SelectTrigger>
                        <SelectContent className="border-purple-500/20 bg-purple-950 text-white focus-visible:border-0 focus-visible:ring-purple-500/20">
                            {competitionMap.map((competition) => (
                                <SelectItem
                                    key={competition.value}
                                    value={competition.value}
                                    className="data-highlighted:bg-purple-500/20 data-highlighted:text-white"
                                >
                                    {competition.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {isTeamCompetition && (
                    <div className="sm:col-span-2">
                        <FormField
                            name="team_name"
                            label="Team Name"
                            error={errors.team_name}
                            required
                        >
                            <Input
                                id="team_name"
                                value={data.team_name}
                                onChange={(event) =>
                                    onChange('team_name', event.target.value)
                                }
                                className="autofill:box-shadow border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                                placeholder="Your team name"
                                disabled={!canFillTeamDetails}
                                required
                            />
                        </FormField>
                    </div>
                )}

                <FormField name="leader_name" label={leaderNameLabel} required>
                    <Input
                        id="leader_name"
                        value={auth.user.name}
                        placeholder="Your name"
                        className="border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                        readOnly
                        disabled={!canFillTeamDetails}
                    />
                </FormField>

                <FormField
                    name="leader_email"
                    label={leaderEmailLabel}
                    required
                >
                    <Input
                        id="leader_email"
                        value={auth.user.email}
                        placeholder="Your email"
                        className="border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                        readOnly
                        disabled={!canFillTeamDetails}
                    />
                </FormField>

                <FormField
                    name="phone_number"
                    label="Phone Number"
                    error={errors.phone_number}
                    required
                >
                    <Input
                        id="phone_number"
                        value={data.phone_number}
                        onChange={(event) =>
                            onChange('phone_number', event.target.value)
                        }
                        className="border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                        placeholder="08xxxxxxxxxx"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </FormField>

                <FormField
                    name="institution"
                    label="Institution"
                    error={errors.institution}
                >
                    <Input
                        id="institution"
                        value={data.institution}
                        onChange={(event) =>
                            onChange('institution', event.target.value)
                        }
                        className="border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                        placeholder="School / University / Community"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </FormField>

                {isTeamCompetition && (
                    <div className="sm:col-span-2">
                        <DynamicTeamInput
                            id="members"
                            label="Team Members"
                            hint={`Add up to ${maxAdditionalMembers || 1} team members (leader is counted separately).`}
                            value={data.members}
                            error={errors}
                            onChange={(members) =>
                                onChange(
                                    'members',
                                    members.slice(
                                        0,
                                        maxAdditionalMembers || members.length,
                                    ),
                                )
                            }
                            required
                            disabled={!canFillTeamDetails}
                            maxItems={maxAdditionalMembers}
                        />
                    </div>
                )}
            </div>
        </StepCard>
    );
}
