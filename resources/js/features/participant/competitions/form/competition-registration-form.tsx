import type { FormErrors, Option } from '@/types';
import type { RegisterCompetitionFormDataType } from '@/validations/register-competition-schema';
import RegisterCompetitionInfoStep from '../components/register-competition-info-step';
import RegisterCompetitionPaymentStep from '../components/register-competition-payment-step';
import RegisterCompetitionRequirementStep from '../components/register-competition-requirement-step';
import type { RegisterStepId } from '../components/register-stepper';

type RegisterCompetitionFormProps = {
    step: RegisterStepId;
    competitionMap: Option[];
    data: RegisterCompetitionFormDataType;
    errors: FormErrors<RegisterCompetitionFormDataType>;
    isTeamCompetition: boolean;
    canFillTeamDetails: boolean;
    selectedCompetition?: Option & {
        otherValues?: {
            max_member?: string;
            price?: number | string;
        };
    };
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
    if (step === 'info') {
        return (
            <RegisterCompetitionInfoStep
                competitionMap={competitionMap}
                data={data}
                errors={errors}
                isTeamCompetition={isTeamCompetition}
                canFillTeamDetails={canFillTeamDetails}
                selectedCompetition={selectedCompetition}
                onCompetitionChange={onCompetitionChange}
                onChange={onChange}
            />
        );
    }

    if (step === 'requirement') {
        return (
            <RegisterCompetitionRequirementStep
                data={data}
                errors={errors}
                canFillTeamDetails={canFillTeamDetails}
                onChange={onChange}
            />
        );
    }

    return (
        <RegisterCompetitionPaymentStep
            data={data}
            errors={errors}
            canFillTeamDetails={canFillTeamDetails}
            selectedCompetition={selectedCompetition}
            onChange={onChange}
        />
    );
}
