import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import getQueryParam from '@/helpers/get-query-param';
import { useIsMobile } from '@/hooks/use-mobile';
import { useZod } from '@/hooks/use-zod';
import AppLayout from '@/layouts/app-layout';
import guestCompetitions from '@/routes/guest/competitions';
import competitions from '@/routes/participant/competitions';
import { CompetitionTypeMap, TransactionPaymentMethodMap } from '@/types';
import type {
    Auth,
    Option,
    TeamMember,
    TransactionPaymentMethodType,
} from '@/types';
import type { RegisterCompetitionSchemaType } from '@/validations/register-competition-schema';
import {
    RegisterCompetitionInfoStepSchema,
    RegisterCompetitionPaymentStepSchema,
    RegisterCompetitionSchema,
} from '@/validations/register-competition-schema';
import {
    CompetitionSummaryPanel,
    MobileSummarySheet,
    RegisterCompetitionForm,
    RegisterStepper,
} from '@/features/participant/competitions';
import type { RegisterStepId } from '@/features/participant/competitions';

interface RegisterCompetitionPageProps {
    competitionMap: Option[];
    auth: Auth;
}

type RegisterCompetitionFormDataType = {
    competition_id: string;
    team_name?: string;
    institution?: string;
    phone_number: string;
    payment_method: TransactionPaymentMethodType;
    payment_proof_file?: File;
    members: TeamMember[];
};

export default function RegisterCompetitionPage({
    competitionMap,
}: RegisterCompetitionPageProps) {
    const preselectedCompetitionSlug = getQueryParam('competition');

    const preselectedCompetition = competitionMap.find(
        (competition) =>
            competition.otherValues?.slug === preselectedCompetitionSlug,
    );

    const [currentStep, setCurrentStep] = useState<RegisterStepId>('info');

    const isMobile = useIsMobile();

    const form = useForm<RegisterCompetitionFormDataType>({
        competition_id: preselectedCompetition?.value || '',
        team_name: '',
        institution: '',
        phone_number: '',
        payment_method: TransactionPaymentMethodMap.qris.value,
        payment_proof_file: undefined,
        members:
            preselectedCompetition?.otherValues?.type ===
            CompetitionTypeMap.Team.value
                ? [{ member_name: '' }]
                : [],
    });

    const selectedCompetition = useMemo(
        () =>
            competitionMap.find(
                (competition) => competition.value === form.data.competition_id,
            ),
        [form.data.competition_id, competitionMap],
    );

    const selectedCompetitionType = selectedCompetition?.otherValues?.type;
    const selectedCompetitionMaxMember = Number(
        selectedCompetition?.otherValues?.max_member ?? 0,
    );

    const { guard: guardFullForm } = useZod<RegisterCompetitionSchemaType>(
        RegisterCompetitionSchema(
            selectedCompetitionType,
            selectedCompetitionMaxMember,
        ),
    );

    const { guard: guardInfoStep } = useZod(
        RegisterCompetitionInfoStepSchema(
            selectedCompetitionType,
            selectedCompetitionMaxMember,
        ),
    );

    const { guard: guardPaymentStep } = useZod(
        RegisterCompetitionPaymentStepSchema,
    );

    const isTeamCompetition =
        selectedCompetition?.otherValues?.type ===
        CompetitionTypeMap.Team.value;
    const canFillTeamDetails = form.data.competition_id.length > 0;

    const handleCompetitionChange = (competitionId: string) => {
        const competition = competitionMap.find(
            (item) => item.value === competitionId,
        );

        const maxAdditionalMembers =
            competition?.otherValues?.type === CompetitionTypeMap.Team.value &&
            Number(competition?.otherValues?.max_member) >= 2
                ? Number(competition?.otherValues?.max_member) - 1
                : 0;

        form.setData((previous) => ({
            ...previous,
            competition_id: competitionId,
            members:
                competition?.otherValues?.type === CompetitionTypeMap.Team.value
                    ? previous.members.length > 0
                        ? previous.members.slice(0, maxAdditionalMembers)
                        : [{ member_name: '' }]
                    : [],
        }));
    };

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!guardInfoStep(form.data, form.setError)) {
            return;
        }

        setCurrentStep('payment');
    };

    const handleBack = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setCurrentStep('info');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (currentStep === 'info') {
            handleNext();

            return;
        }

        if (!guardPaymentStep(form.data, form.setError)) {
            return;
        }

        if (!guardFullForm(form.data, form.setError)) {
            return;
        }

        form.post(competitions.register.store.url());
    };

    const handleReset = () => {
        form.resetAndClearErrors(
            'team_name',
            'institution',
            'phone_number',
            'payment_method',
            'payment_proof_file',
            'members',
        );
        form.setData('members', isTeamCompetition ? [{ member_name: '' }] : []);
        setCurrentStep('info');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AppLayout>
            <Head title="Initialize Mission Deployment" />

            <div className="relative w-full bg-transparent py-6 text-zinc-100 md:py-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6">
                    {/* TOP CONTROL NAVIGATION */}
                    <div className="flex items-center justify-between border-b border-purple-950/60 pb-4">
                        <Link
                            href={guestCompetitions.index.url()}
                            className="group inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-purple-400"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            <span>[ ABORT_REGISTRATION ]</span>
                        </Link>

                        <div className="hidden font-mono text-[10px] tracking-[0.25em] text-purple-400/50 uppercase sm:block">
                            // SECURE_REGISTRATION_GATEWAY_V1.0
                        </div>
                    </div>

                    <div className="border-b border-purple-950/60 pb-4">
                        <h2 className="flex items-center gap-2 font-sans text-xl font-black tracking-tight text-white uppercase">
                            <span className="font-mono text-sm text-purple-500">
                                //
                            </span>
                            REGISTRATION_MANIFEST
                        </h2>
                        <p className="mt-1 font-mono text-xs text-purple-300/50">
                            FILL OUT ALL FIELD UNITS ACCORDINGLY.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.7fr]"
                    >
                        <div className="space-y-6">
                            <RegisterStepper currentStep={currentStep} />

                            <RegisterCompetitionForm
                                step={currentStep}
                                competitionMap={competitionMap}
                                data={form.data}
                                errors={form.errors}
                                isTeamCompetition={isTeamCompetition}
                                canFillTeamDetails={canFillTeamDetails}
                                selectedCompetition={selectedCompetition}
                                onCompetitionChange={handleCompetitionChange}
                                onChange={form.setData}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-950/60 pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-purple-900/40 bg-purple-950/10 px-5 font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase transition-all hover:bg-purple-950/30 hover:text-zinc-200"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    RESET_MANIFEST
                                </button>

                                <div className="flex gap-3">
                                    {currentStep === 'payment' && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-5 font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase transition-all hover:bg-zinc-900/50 hover:text-zinc-100"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5" />
                                            BACK
                                        </button>
                                    )}

                                    {currentStep === 'info' ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!form.data.competition_id}
                                            className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-lg px-6 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                                color: '#F3E8FF',
                                                boxShadow:
                                                    '0 0 20px rgba(177,59,255,0.35)',
                                            }}
                                        >
                                            <span className="relative z-10 inline-flex items-center gap-2">
                                                Next
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={
                                                form.processing ||
                                                !form.data.competition_id
                                            }
                                            className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-lg px-6 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                                color: '#F3E8FF',
                                                boxShadow:
                                                    '0 0 20px rgba(177,59,255,0.35)',
                                            }}
                                        >
                                            <span className="relative z-10 inline-flex items-center gap-2">
                                                {form.processing && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                                REGISTER
                                            </span>
                                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isMobile && (
                            <div className="hidden space-y-4 lg:block">
                                <CompetitionSummaryPanel
                                    selectedCompetition={selectedCompetition}
                                />
                            </div>
                        )}
                    </form>

                    {isMobile && (
                        <MobileSummarySheet
                            selectedCompetition={selectedCompetition}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
