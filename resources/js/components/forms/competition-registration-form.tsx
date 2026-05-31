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
import {
    TransactionPaymentMethodMap,
    TransactionPaymentMethodValue,
} from '@/types';
import type { FormErrors, Option, TransactionPaymentMethodType } from '@/types';
import type { RegisterCompetitionFormDataType } from '@/validations/register-competition-schema';

type RegisterCompetitionFormProps = {
    competitionMap: Option[];
    data: RegisterCompetitionFormDataType;
    errors: FormErrors<RegisterCompetitionFormDataType>;
    isTeamCompetition: boolean;
    canFillTeamDetails: boolean;
    selectedCompetition?: Option;
    onCompetitionChange: (competitionId: string) => void;
    onChange: <K extends keyof RegisterCompetitionFormDataType>(
        key: K,
        value: RegisterCompetitionFormDataType[K],
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
    const isQrisPayment =
        data.payment_method === TransactionPaymentMethodValue[0];
    const maxAdditionalMembers =
        isTeamCompetition &&
        Number(selectedCompetition?.otherValues?.max_member) >= 2
            ? Number(selectedCompetition?.otherValues?.max_member) - 1
            : undefined;

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

                <div className="space-y-4 sm:col-span-2">
                    {isTeamCompetition && (
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
                    )}

                    <FormField
                        name="payment_method"
                        label="Payment Method"
                        error={errors.payment_method}
                        required
                    >
                        <Select
                            value={data.payment_method}
                            onValueChange={(value) =>
                                onChange(
                                    'payment_method',
                                    value as TransactionPaymentMethodType,
                                )
                            }
                            disabled={!canFillTeamDetails}
                            required
                        >
                            <SelectTrigger
                                id="payment_method"
                                className="w-full"
                            >
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>

                            <SelectContent>
                                {Object.values(TransactionPaymentMethodMap).map(
                                    (method) => (
                                        <SelectItem
                                            key={method.value}
                                            value={method.value}
                                        >
                                            {method.label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>

                {isQrisPayment && (
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 sm:col-span-2">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">
                                QRIS Payment
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Scan this QRIS code to complete the payment.
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            {/* TODO: Change with real QRIS */}
                            <img
                                src="https://chart.googleapis.com/chart?chs=320x320&cht=qr&chl=QRIS%20Payment%20Placeholder"
                                alt="QRIS payment code"
                                className="h-56 w-56 rounded-2xl border border-border bg-white p-3 shadow-sm"
                            />
                        </div>
                    </div>
                )}

                <div className="sm:col-span-2">
                    <FormField
                        name="payment_proof_file"
                        label="Payment Proof"
                        error={errors.payment_proof_file}
                        required
                    >
                        <Input
                            id="payment_proof_file"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) =>
                                onChange(
                                    'payment_proof_file',
                                    event.target.files?.[0],
                                )
                            }
                            disabled={!canFillTeamDetails}
                            required
                        />
                    </FormField>
                </div>
            </div>
        </div>
    );
}
