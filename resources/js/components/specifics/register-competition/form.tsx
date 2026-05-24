import { usePage } from '@inertiajs/react';
import { FormField } from '@/components/form-field';
import { DynamicTeamInput } from '@/components/specifics/dynamic-team-input';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FormErrors, Option } from '@/types';
import type { RegisterCompetitionSchemaType } from '@/validations/register-competition-schema';

type RegisterCompetitionFormProps = {
    competitionMap: Option[];
    data: RegisterCompetitionSchemaType;
    errors: FormErrors<RegisterCompetitionSchemaType>;
    isTeamCompetition: boolean;
    canFillTeamDetails: boolean;
    selectedCompetition?: Option;
    onCompetitionChange: (competitionId: string) => void;
    onChange: <K extends keyof RegisterCompetitionSchemaType>(
        key: K,
        value: RegisterCompetitionSchemaType[K],
    ) => void;
};

export default function RegisterCompetitionForm({
    competitionMap,
    data,
    errors,
    isTeamCompetition,
    canFillTeamDetails,
    selectedCompetition,
    onCompetitionChange,
    onChange,
}: RegisterCompetitionFormProps) {
    const auth = usePage().props.auth;

    const leaderNameLabel = isTeamCompetition ? 'Leader Name' : 'Your Name';
    const leaderEmailLabel = isTeamCompetition ? 'Leader Email' : 'Your Email';

    return (
        <div className="space-y-5 rounded-3xl border border-border/60 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] dark:bg-[#111111]">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    Team Information
                </h2>
                <p className="text-sm text-muted-foreground">
                    Fill in your team details to continue.
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
                        <SelectTrigger id="competition_id" className="w-full">
                            <SelectValue placeholder="Select a competition first" />
                        </SelectTrigger>
                        <SelectContent>
                            {competitionMap.map((competition) => (
                                <SelectItem
                                    key={competition.value}
                                    value={competition.value}
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
                        placeholder="08xxxxxxxxxx"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </FormField>

                {/* TODO: Add Institution */}
                {/* <FormField
                    name="institution"
                    label="Institution"
                    error={errors.institution}
                    required
                >
                    <Input
                        id="institution"
                        value={data.institution}
                        onChange={(event) =>
                            onChange('institution', event.target.value)
                        }
                        placeholder="School / University / Community"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </FormField> */}
            </div>

            {isTeamCompetition && (
                <DynamicTeamInput
                    id="members"
                    label="Team Members"
                    hint={`Add up to ${selectedCompetition?.otherValues?.maxMembers || 1} members for this team competition.`}
                    value={data.members}
                    error={errors}
                    onChange={(members) =>
                        onChange(
                            'members',
                            members.slice(
                                0,
                                selectedCompetition?.otherValues?.maxMembers ||
                                    members.length,
                            ),
                        )
                    }
                    required
                    disabled={!canFillTeamDetails}
                />
            )}
        </div>
    );
}
