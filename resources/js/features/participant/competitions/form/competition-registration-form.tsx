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
import {
    TransactionPaymentMethodMap,
    TransactionPaymentMethodValue,
} from '@/types';
import type { FormErrors, Option, TransactionPaymentMethodType } from '@/types';
import type { RegisterCompetitionFormDataType } from '@/validations/register-competition-schema';
import type { RegisterStepId } from '../components/register-stepper';
import StepCard from '../components/step-card';

type RegisterCompetitionFormProps = {
    step: RegisterStepId;
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
    step,
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

    if (step === 'info') {
        return (
            <StepCard>
                <div className="space-y-1 border-b border-zinc-800 pb-4">
                    <h2 className="font-sans text-xl font-black text-white uppercase">
                        Team Information
                    </h2>
                    <p className="font-mono text-xs text-zinc-500">
                        FILL IN YOUR TEAM DETAILS TO CONTINUE.
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
                                        onChange(
                                            'team_name',
                                            event.target.value,
                                        )
                                    }
                                    className="autofill:box-shadow border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                                    placeholder="Your team name"
                                    disabled={!canFillTeamDetails}
                                    required
                                />
                            </FormField>
                        </div>
                    )}

                    <FormField
                        name="leader_name"
                        label={leaderNameLabel}
                        required
                    >
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
                                            maxAdditionalMembers ||
                                                members.length,
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

    return (
        <StepCard>
            <div className="space-y-1 border-b border-zinc-800 pb-4">
                <h2 className="font-sans text-xl font-black tracking-tight text-white uppercase">
                    Payment
                </h2>
                <p className="font-mono text-xs text-zinc-500">
                    CHOOSE A PAYMENT METHOD AND UPLOAD YOUR PROOF.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
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
                                className="w-full border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                            >
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>

                            <SelectContent className="border-purple-500/20 bg-purple-950 text-white focus-visible:border-0 focus-visible:ring-purple-500/20">
                                {Object.values(TransactionPaymentMethodMap).map(
                                    (method) => (
                                        <SelectItem
                                            className="data-highlighted:bg-purple-500/20 data-highlighted:text-white"
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
                    <div className="rounded-2xl border border-purple-900/30 bg-purple-950/10 p-4 sm:col-span-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-zinc-200">
                                QRIS Payment
                            </p>
                            <p className="text-sm text-zinc-500">
                                Scan this QRIS code to complete the payment.
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <img
                                src="/assets/png/qris-payment-code.png"
                                alt="QRIS Payment Code"
                                className="h-80 rounded-2xl border border-purple-900/30 p-3"
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
                            className="border-purple-500/20 file:mr-2 file:border-r file:border-zinc-800 file:pr-2 file:text-zinc-200 focus-visible:border-0 focus-visible:ring-purple-500/20"
                            disabled={!canFillTeamDetails}
                            required
                        />
                    </FormField>
                </div>
            </div>
        </StepCard>
    );
}
