import type { FormEvent } from 'react';
import { DynamicTeamInput } from '@/components/specifics/dynamic-team-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Option } from '@/types';
import type { RegistrationForm } from '@/types/register-competition';

type RegisterCompetitionFormProps = {
    competitionMap: Option[];
    form: RegistrationForm;
    isTeamCompetition: boolean;
    canFillTeamDetails: boolean;
    selectedCompetition?: Option;
    onCompetitionChange: (competitionId: string) => void;
    onUpdateForm: <K extends keyof RegistrationForm>(
        key: K,
        value: RegistrationForm[K],
    ) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
};

export default function RegisterCompetitionForm({
    competitionMap,
    form,
    isTeamCompetition,
    canFillTeamDetails,
    selectedCompetition,
    onCompetitionChange,
    onUpdateForm,
    onSubmit,
    onReset,
}: RegisterCompetitionFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-3xl border border-border/60 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] dark:bg-[#111111]"
        >
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    Team Information
                </h2>
                <p className="text-sm text-muted-foreground">
                    Fill in your team details to continue.
                </p>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="competition_id"
                    className="text-sm leading-none font-medium"
                >
                    Competition
                    <span className="text-destructive"> *</span>
                </label>
                <Select
                    value={form.competition_id}
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                    <label
                        htmlFor="team_name"
                        className="text-sm leading-none font-medium"
                    >
                        Team Name
                        <span className="text-destructive"> *</span>
                    </label>
                    <Input
                        id="team_name"
                        value={form.team_name}
                        onChange={(event) =>
                            onUpdateForm('team_name', event.target.value)
                        }
                        placeholder="Example: Skyline Builders"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label
                        htmlFor="leader_name"
                        className="text-sm leading-none font-medium"
                    >
                        Leader Name
                        <span className="text-destructive"> *</span>
                    </label>
                    <Input
                        id="leader_name"
                        value={form.leader_name}
                        onChange={(event) =>
                            onUpdateForm('leader_name', event.target.value)
                        }
                        disabled={!canFillTeamDetails}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label
                        htmlFor="leader_email"
                        className="text-sm leading-none font-medium"
                    >
                        Leader Email
                        <span className="text-destructive"> *</span>
                    </label>
                    <Input
                        id="leader_email"
                        type="email"
                        value={form.leader_email}
                        onChange={(event) =>
                            onUpdateForm('leader_email', event.target.value)
                        }
                        disabled={!canFillTeamDetails}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label
                        htmlFor="phone_number"
                        className="text-sm leading-none font-medium"
                    >
                        Phone Number
                        <span className="text-destructive"> *</span>
                    </label>
                    <Input
                        id="phone_number"
                        value={form.phone_number}
                        onChange={(event) =>
                            onUpdateForm('phone_number', event.target.value)
                        }
                        placeholder="08xxxxxxxxxx"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label
                        htmlFor="institution"
                        className="text-sm leading-none font-medium"
                    >
                        Institution
                        <span className="text-destructive"> *</span>
                    </label>
                    <Input
                        id="institution"
                        value={form.institution}
                        onChange={(event) =>
                            onUpdateForm('institution', event.target.value)
                        }
                        placeholder="School / University / Community"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </div>
            </div>

            {isTeamCompetition && (
                <DynamicTeamInput
                    id="members"
                    label="Team Members"
                    hint={`Add up to ${selectedCompetition?.otherValues?.maxMembers || 1} members for this team competition.`}
                    value={form.members}
                    onChange={(members) =>
                        onUpdateForm(
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

            <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={!canFillTeamDetails}>
                    Submit (Dummy)
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                    Reset form
                </Button>
            </div>
        </form>
    );
}
