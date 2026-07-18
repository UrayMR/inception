import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import type { FormErrors } from '@/types';
import type { RegisterCompetitionFormDataType } from '@/validations/register-competition-schema';
import StepCard from './step-card';

type RegisterCompetitionRequirementStepProps = {
    data: RegisterCompetitionFormDataType;
    errors: FormErrors<RegisterCompetitionFormDataType>;
    canFillTeamDetails: boolean;
    onChange: <K extends keyof RegisterCompetitionFormDataType>(
        key: K,
        value: RegisterCompetitionFormDataType[K],
    ) => void;
};

export default function RegisterCompetitionRequirementStep({
    data,
    errors,
    canFillTeamDetails,
    onChange,
}: RegisterCompetitionRequirementStepProps) {
    return (
        <StepCard>
            <div className="space-y-1 border-b border-zinc-800 pb-4">
                <h2 className="font-sans text-xl font-black text-white uppercase">
                    Requirements
                </h2>
                <p className="font-mono text-xs text-zinc-500">
                    Please fill in the requirement link and make sure all the
                    data is correct before proceeding to the next step.
                </p>
            </div>

            <div className="space-y-1.5">
                <div className="mb-4 space-y-1.5 rounded-lg border border-purple-500/10 bg-purple-950/10 p-3">
                    <ul className="list-disc space-y-1.5 pl-4 font-mono text-[11px] leading-relaxed text-zinc-500">
                        <li>
                            Bukti screenshot unggahan feed dan share poster
                            Instagram story di akun Instagram masing-masing.
                            Dikumpulkan menjadi satu file PDF dengan format
                            penamaan{' '}
                            <span className="text-purple-400">
                                "Feeds_NamaTim"
                            </span>
                            .
                        </li>
                        <li>
                            Bukti Kartu Tanda Mahasiswa (KTM). Khusus mahasiswa
                            baru yang belum memiliki KTM, wajib melampirkan
                            surat keterangan mahasiswa aktif atau dokumen resmi
                            lain yang menunjukkan status sebagai mahasiswa
                            aktif. Dikumpulkan dalam format file PDF dengan
                            format penamaan{' '}
                            <span className="text-purple-400">
                                "KTM_NamaTim"
                            </span>
                            .
                        </li>
                    </ul>
                </div>

                <FormField
                    name="requirement_link"
                    label="Requirement Link"
                    error={errors.requirement_link}
                    required
                >
                    <Input
                        id="requirement_link"
                        value={data.requirement_link}
                        onChange={(event) =>
                            onChange('requirement_link', event.target.value)
                        }
                        className="autofill:box-shadow border-purple-500/20 focus-visible:border-0 focus-visible:ring-purple-500/20"
                        placeholder="Your requirement link"
                        disabled={!canFillTeamDetails}
                        required
                    />
                </FormField>

                <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
                    Pastikan link berupa folder/file Google Drive yang sudah
                    di-set{' '}
                    <span className="text-purple-400">
                        "Anyone with the link"
                    </span>{' '}
                    (publik), agar panitia bisa mengaksesnya untuk verifikasi.
                </p>
            </div>
        </StepCard>
    );
}
