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
                <div className="space-y-1.5 sm:col-span-2">
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
                            placeholder="Example: Skyline Builders"
                            disabled={!canFillTeamDetails}
                            required
                        />
                    </FormField>
                </div>

                <div className="space-y-1.5">
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
                </div>

                <div className="space-y-1.5">
                    <FormField
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
                    </FormField>
                </div>
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
