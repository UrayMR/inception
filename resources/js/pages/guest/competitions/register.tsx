import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import type { FormEvent } from 'react';
import RegisterCompetitionForm from '@/components/specifics/register-competition/form';
import RegisterCompetitionHero from '@/components/specifics/register-competition/hero';
import RegisterCompetitionSummary from '@/components/specifics/register-competition/summary';
import { Button } from '@/components/ui/button';
import getQueryParam from '@/helpers/get-query-param';
import { useZod } from '@/hooks/use-zod';
import AppLayout from '@/layouts/app-layout';
import { CompetitionTypeMap } from '@/types';
import type { Auth, Option } from '@/types';
import type { RegisterCompetitionSchemaType } from '@/validations/register-competition-schema';
import { RegisterCompetitionSchema } from '@/validations/register-competition-schema';

interface RegisterCompetitionPageProps {
    competitionMap: Option[];
    auth: Auth;
}

// TODO: This page implement too many kinds of different logic that can't be read easily.
export default function RegisterCompetitionPage({
    competitionMap,
}: RegisterCompetitionPageProps) {
    const preselectedCompetitionSlug = getQueryParam('competition');

    const preselectedCompetition = competitionMap.find(
        (competition) =>
            competition.otherValues?.slug === preselectedCompetitionSlug,
    );

    const form = useForm<RegisterCompetitionSchemaType>({
        competition_id: preselectedCompetition?.value || '',
        team_name: '',
        phone_number: '',
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

    const { guard } = useZod<RegisterCompetitionSchemaType>(
        RegisterCompetitionSchema(selectedCompetitionType),
    );

    const isTeamCompetition =
        selectedCompetition?.otherValues?.type ===
        CompetitionTypeMap.Team.value;
    const canFillTeamDetails = form.data.competition_id.length > 0;

    const handleCompetitionChange = (competitionId: string) => {
        const competition = competitionMap.find(
            (item) => item.value === competitionId,
        );

        form.setData((previous) => ({
            ...previous,
            competition_id: competitionId,
            members:
                competition?.otherValues?.type === CompetitionTypeMap.Team.value
                    ? previous.members.length > 0
                        ? previous.members
                        : [{ member_name: '' }]
                    : [],
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!guard(form.data, form.setError)) {
            return;
        }
    };

    const handleReset = () => {
        form.resetAndClearErrors('team_name', 'phone_number', 'members');
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
