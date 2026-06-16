import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import RegisterCompetitionHero from '@/features/participant/competitions/components/hero';
import RegisterCompetitionSummary from '@/features/participant/competitions/components/summary';
import RegisterCompetitionForm from '@/features/participant/competitions/form/competition-registration-form';
import getQueryParam from '@/helpers/get-query-param';
import { useZod } from '@/hooks/use-zod';
import AppLayout from '@/layouts/app-layout';
import competitions from '@/routes/participant/competitions';
import { CompetitionTypeMap, TransactionPaymentMethodMap } from '@/types';
import type {
    Auth,
    Option,
    TeamMember,
    TransactionPaymentMethodType,
} from '@/types';
import type { RegisterCompetitionSchemaType } from '@/validations/register-competition-schema';
import { RegisterCompetitionSchema } from '@/validations/register-competition-schema';

interface RegisterCompetitionPageProps {
    competitionMap: Option[];
    auth: Auth;
}

type RegisterCompetitionForm = {
    competition_id: string;
    team_name?: string;
    phone_number: string;
    payment_method: TransactionPaymentMethodType;
    payment_proof_file?: File;
    members: TeamMember[];
};

// TODO: This page implement too many kinds of different logic that can't be read easily.
export default function RegisterCompetitionPage({
    competitionMap,
}: RegisterCompetitionPageProps) {
    const preselectedCompetitionSlug = getQueryParam('competition');

    const preselectedCompetition = competitionMap.find(
        (competition) =>
            competition.otherValues?.slug === preselectedCompetitionSlug,
    );

    const form = useForm<RegisterCompetitionForm>({
        competition_id: preselectedCompetition?.value || '',
        team_name: '',
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

    const { guard } = useZod<RegisterCompetitionSchemaType>(
        RegisterCompetitionSchema(
            selectedCompetitionType,
            selectedCompetitionMaxMember,
        ),
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

    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }

        form.post(competitions.register.store.url());
    };

    const handleReset = () => {
        form.resetAndClearErrors(
            'team_name',
            'phone_number',
            'payment_method',
            'payment_proof_file',
            'members',
        );
        form.setData('members', isTeamCompetition ? [{ member_name: '' }] : []);
    };

    return (
        <AppLayout>
            <Head title="Competition Registration" />
            <div className="bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
                    <RegisterCompetitionHero />

                    <form onSubmit={handleSubmit}>
                        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            <RegisterCompetitionForm
                                competitionMap={competitionMap}
                                data={form.data}
                                errors={form.errors}
                                isTeamCompetition={isTeamCompetition}
                                canFillTeamDetails={canFillTeamDetails}
                                selectedCompetition={selectedCompetition}
                                onCompetitionChange={handleCompetitionChange}
                                onChange={form.setData}
                            />

                            <RegisterCompetitionSummary
                                selectedCompetition={selectedCompetition}
                            />
                        </section>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                            >
                                Reset form
                            </Button>

                            <Button type="submit" disabled={form.processing}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
