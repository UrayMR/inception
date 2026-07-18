import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    CompetitionSummaryPanel,
    MobileSummarySheet,
    RegisterCompetitionForm,
    RegisterStepper,
} from '@/features/participant/competitions';
import type { RegisterStepId } from '@/features/participant/competitions';
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
    RegisterCompetitionRequirementStepSchema,
    RegisterCompetitionSchema,
} from '@/validations/register-competition-schema';

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
    requirement_link: string;
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

    const STEP_ORDER: RegisterStepId[] = ['info', 'requirement', 'payment'];
    const [currentStep, setCurrentStep] = useState<RegisterStepId>('info');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isMobile = useIsMobile();

    const form = useForm<RegisterCompetitionFormDataType>({
        competition_id: preselectedCompetition?.value || '',
        team_name: '',
        institution: '',
        phone_number: '',
        payment_method: TransactionPaymentMethodMap.qris.value,
        payment_proof_file: undefined,
        requirement_link: '',
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

    const { guard: guardRequirementStep } = useZod(
        RegisterCompetitionRequirementStepSchema,
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

    const stepGuards: Partial<
        Record<
            RegisterStepId,
            (
                data: RegisterCompetitionFormDataType,
                setError: typeof form.setError,
            ) => boolean
        >
    > = {
        info: guardInfoStep,
        requirement: guardRequirementStep,
        payment: guardPaymentStep,
    };

    const currentStepIndex = STEP_ORDER.indexOf(currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEP_ORDER.length - 1;

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const guard = stepGuards[currentStep];

        if (guard && !guard(form.data, form.setError)) {
            return;
        }

        if (currentStep === 'requirement') {
            setIsConfirmOpen(true);

            return;
        }

        const nextStep = STEP_ORDER[currentStepIndex + 1];

        if (nextStep) {
            setCurrentStep(nextStep);
        }
    };

    const handleBack = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const prevStep = STEP_ORDER[currentStepIndex - 1];

        if (prevStep) {
            setCurrentStep(prevStep);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!isLastStep) {
            handleNext();

            return;
        }

        if (!guardFullForm(form.data, form.setError)) {
            return;
        }

        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        setIsConfirmOpen(false);

        if (currentStep === 'requirement') {
            const nextStep = STEP_ORDER[currentStepIndex + 1];

            if (nextStep) {
                setCurrentStep(nextStep);
            }

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
            'requirement_link',
            'payment_proof_file',
            'members',
        );
        form.setData('members', isTeamCompetition ? [{ member_name: '' }] : []);
        setCurrentStep(STEP_ORDER[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AppLayout>
            <Head title="Participant Registration" />

            <div className="relative w-full bg-transparent py-6 text-zinc-100 md:py-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6">
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

                    <div className="pb-4">
                        <h1 className="flex items-center gap-2 font-sans text-2xl font-black tracking-wider text-white uppercase">
                            PARTICIPANT REGISTRATION
                        </h1>
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
                                    RESET
                                </button>

                                <div className="flex gap-3">
                                    {!isFirstStep && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-5 font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase transition-all hover:bg-zinc-900/50 hover:text-zinc-100"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5" />
                                            BACK
                                        </button>
                                    )}

                                    {!isLastStep ? (
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

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-sans tracking-wide text-white uppercase">
                            {currentStep === 'requirement'
                                ? 'VALIDASI TAUTAN BERKAS'
                                : 'KONFIRMASI REGISTRASI'}
                        </AlertDialogTitle>

                        {currentStep === 'requirement' ? (
                            <>
                                <AlertDialogDescription className="text-zinc-400">
                                    Pastikan tautan (link) Google Drive yang
                                    Anda masukkan sudah diatur ke status{' '}
                                    <span className="font-bold text-purple-400">
                                        Public (Anyone with the link / Siapa
                                        saja yang memiliki link)
                                    </span>{' '}
                                    agar panitia dapat memeriksa berkas
                                    persyaratan Anda.
                                </AlertDialogDescription>
                                <AlertDialogDescription className="mt-2 text-xs text-rose-500">
                                    Tautan yang tidak dapat diakses akan
                                    menyebabkan pendaftaran Anda ditolak.
                                </AlertDialogDescription>
                            </>
                        ) : (
                            <>
                                <AlertDialogDescription className="text-zinc-400">
                                    Apakah Anda yakin semua data yang diisi
                                    telah benar? Anda akan didaftarkan ke
                                    kompetisi{' '}
                                    <span className="font-semibold text-purple-400">
                                        {selectedCompetition?.label}
                                    </span>
                                    .
                                </AlertDialogDescription>
                                <AlertDialogDescription className="mt-2 text-xs text-rose-500">
                                    Data yang sudah dikirim tidak dapat diubah
                                    kembali.
                                </AlertDialogDescription>
                            </>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                            Kembali
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSubmit}
                            className="bg-purple-600 font-semibold text-white hover:bg-purple-700"
                        >
                            {currentStep === 'requirement'
                                ? 'Sudah, Lanjutkan'
                                : 'Ya, Kirim'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
