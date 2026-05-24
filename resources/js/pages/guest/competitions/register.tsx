import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { Auth, Option } from '@/types';
import { CompetitionTypeMap } from '@/types';
import RegisterCompetitionForm from '@/components/specifics/register-competition/form';
import RegisterCompetitionHero from '@/components/specifics/register-competition/hero';
import RegisterCompetitionSummary from '@/components/specifics/register-competition/summary';
import getQueryParam from '@/helpers/get-query-param';
import type { RegistrationForm } from '@/types/register-competition';

const defaultMember = { member_name: '' };

type RegisterCompetitionProps = {
    competitionMap: Option[];
    auth: Auth;
};

// TODO: Refactor this page, handling too many kinds of different logic that can't be read easily.
// Add Zod Schema Validation for form validation and type safety.
export default function RegisterCompetition({
    competitionMap,
    auth,
}: RegisterCompetitionProps) {
    const preselectedCompetitionSlug = getQueryParam('competition');
    const preselectedCompetition = competitionMap.find(
        (competition) =>
            competition.otherValues?.slug === preselectedCompetitionSlug,
    );

    const {
        data: form,
        setData,
        resetAndClearErrors,
    } = useForm<RegistrationForm>({
        competition_id: preselectedCompetition?.value || '',
        team_name: '',
        leader_name: auth.user?.name,
        leader_email: auth.user?.email,
        phone_number: '',
        institution: '',
        members:
            preselectedCompetition?.otherValues?.type ===
            CompetitionTypeMap.Team.value
                ? [defaultMember]
                : [],
    });

    const selectedCompetition = useMemo(
        () =>
            competitionMap.find(
                (competition) => competition.value === form.competition_id,
            ),
        [form.competition_id, competitionMap],
    );

    const isTeamCompetition =
        selectedCompetition?.otherValues?.type ===
        CompetitionTypeMap.Team.value;
    const canFillTeamDetails = form.competition_id.length > 0;

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }),
        [],
    );

    const updateForm = <K extends keyof RegistrationForm>(
        key: K,
        value: RegistrationForm[K],
    ) => {
        setData(
            (previous) =>
                ({
                    ...previous,
                    [key]: value,
                }) as RegistrationForm,
        );
    };

    const handleCompetitionChange = (competitionId: string) => {
        const competition = competitionMap.find(
            (item) => item.value === competitionId,
        );

        setData((previous) => ({
            ...previous,
            competition_id: competitionId,
            members:
                competition?.otherValues?.type === CompetitionTypeMap.Team.value
                    ? previous.members.length > 0
                        ? previous.members
                        : [defaultMember]
                    : [],
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleReset = () => {
        resetAndClearErrors(
            'team_name',
            'phone_number',
            'institution',
            'members',
        );
        setData('members', isTeamCompetition ? [defaultMember] : []);
    };

    return (
        <AppLayout>
            <Head title="Competition Registration" />
            <div className="bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
                    <RegisterCompetitionHero />

                    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <RegisterCompetitionForm
                            competitionMap={competitionMap}
                            form={form}
                            isTeamCompetition={isTeamCompetition}
                            canFillTeamDetails={canFillTeamDetails}
                            selectedCompetition={selectedCompetition}
                            onCompetitionChange={handleCompetitionChange}
                            onUpdateForm={updateForm}
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                        />

                        <RegisterCompetitionSummary
                            selectedCompetition={selectedCompetition}
                            currencyFormatter={currencyFormatter}
                        />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
