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

const ASSETS_DRIVE_URL =
    'https://drive.google.com/drive/folders/1eYYAL0osYS0HJoKoNjdRRq8Jj6H37tZe?usp=sharing';

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
                    <p className="font-mono text-[11px] font-bold text-purple-300">
                        Panduan Pengumpulan Berkas Tim:
                    </p>
                    <p className="font-mono text-[11px] text-zinc-500">
                        Buat 1 folder Google Drive khusus untuk tim Anda dengan
                        format nama:{' '}
                        <span className="text-purple-400">
                            Requirement_NamaTim
                        </span>
                        . Di dalam folder utama tersebut, buat sub-folder dengan
                        rincian isi sebagai berikut:
                    </p>

                    <ul className="list-disc space-y-2 pl-4 font-mono text-[11px] leading-relaxed text-zinc-500">
                        <li>
                            <strong className="text-zinc-300">
                                Sub-folder "KTM":
                            </strong>{' '}
                            Berisi file foto/PDF Kartu Tanda Mahasiswa (KTM)
                            dari masing-masing anggota.
                            <span className="mt-0.5 block text-zinc-400/80 italic">
                                *Khusus mahasiswa baru yang belum punya KTM,
                                wajib melampirkan surat keterangan mahasiswa
                                aktif atau dokumen resmi lainnya.
                            </span>
                        </li>
                        <li>
                            <strong className="text-zinc-300">
                                Sub-folder "Twibbon":
                            </strong>{' '}
                            Berisi screenshot bukti unggahan twibbon di akun
                            Instagram masing-masing anggota.
                        </li>
                        <li>
                            <strong className="text-zinc-300">
                                Sub-folder "Feeds & Story":
                            </strong>{' '}
                            Berisi screenshot bukti unggahan feed dan share
                            poster Instagram Story pada akun Instagram
                            masing-masing anggota.
                        </li>
                    </ul>

                    <p className="mt-3 border-t border-purple-500/10 pt-3 font-mono text-[11px] leading-relaxed text-zinc-500">
                        Aset twibbon, caption, dan template lainnya dapat
                        diunduh melalui{' '}
                        <a
                            href={ASSETS_DRIVE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
                        >
                            folder Google Drive panitia ini
                        </a>
                        .
                    </p>
                </div>

                <FormField
                    name="requirement_link"
                    label="Requirement Folder Link"
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
                        placeholder="https://drive.google.com/drive/folders/..."
                        disabled={!canFillTeamDetails}
                        required
                    />
                </FormField>

                <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
                    Pastikan link Google Drive sudah di-set aksesnya ke{' '}
                    <span className="text-purple-400">
                        "Anyone with the link"
                    </span>{' '}
                    atau{' '}
                    <span className="text-purple-400">
                        "Siapa saja yang memiliki link"
                    </span>{' '}
                    (publik), agar panitia dapat melakukan verifikasi berkas.
                </p>
            </div>
        </StepCard>
    );
}
