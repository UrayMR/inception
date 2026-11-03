import { Head, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    ExternalLink,
    FileText,
    Lock,
    Mail,
    Phone,
    Trophy,
    Users,
} from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

type TeamMember = {
    member_name: string;
    member_phone_number?: string | null;
};

type ResultPageProps = {
    auth: Auth;

    competition: {
        id: string;
        name: string;
    };

    team: {
        team_name: string;
        leader_name: string;
        leader: {
            email: string;
        };
        phone_number: string;
        is_finalist: boolean;
        institution?: string | null;
        members?: TeamMember[];
    };

    questionnaireUrl: string;
    transparencyUrl: string;
    unlockDelaySeconds: number;
};

const STORAGE_PREFIX = 'participant-competition-result-questionnaire';

const listeners = new Set<() => void>();
const memoryStore = new Map<string, number>();

function subscribeToClickedAt(callback: () => void) {
    listeners.add(callback);
    window.addEventListener('storage', callback); // sync across tabs

    return () => {
        listeners.delete(callback);
        window.removeEventListener('storage', callback);
    };
}

function readClickedAt(key: string): number | null {
    const inMemory = memoryStore.get(key);

    if (inMemory) {
        return inMemory;
    }

    try {
        const parsed = Number(window.localStorage.getItem(key));

        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    } catch {
        return null; // localStorage unavailable
    }
}

function writeClickedAt(key: string, value: number) {
    memoryStore.set(key, value); // keeps countdown working if localStorage fails

    try {
        window.localStorage.setItem(key, String(value));
    } catch {
        // ignore; in-memory value is used
    }

    listeners.forEach((listener) => listener());
}

type TransparencyAccessProps = {
    clickedAt: number | null;
    unlockDelaySeconds: number;
    transparencyUrl: string;
    requiresQuestionnaire: boolean;
};

function TransparencyAccess({
    clickedAt,
    unlockDelaySeconds,
    transparencyUrl,
    requiresQuestionnaire = true,
}: TransparencyAccessProps) {
    const unlockAt =
        clickedAt === null
            ? null
            : clickedAt + Math.max(0, unlockDelaySeconds) * 1000;

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (unlockAt === null) {
            return;
        }

        const updateNow = () => {
            const currentTime = Date.now();
            setNow(currentTime);

            return currentTime >= unlockAt;
        };

        // Recalculate immediately when the timestamp changes or the component mounts.
        if (updateNow()) {
            return;
        }

        const timer = window.setInterval(() => {
            if (updateNow()) {
                window.clearInterval(timer);
            }
        }, 1000);

        return () => window.clearInterval(timer);
    }, [unlockAt]);

    const isTransparencyUnlocked =
        !requiresQuestionnaire || (unlockAt !== null && now >= unlockAt);

    return (
        <div className="relative pl-10">
            <div
                className={`absolute top-0 left-0 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                    isTransparencyUnlocked
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-500'
                }`}
            >
                {requiresQuestionnaire ? '02' : '01'}
            </div>

            <div className="pb-4">
                <h3 className="text-sm font-semibold text-zinc-100">
                    Transparansi Penilaian
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    {requiresQuestionnaire
                        ? 'Akses dokumen transparansi setelah kuisioner diisi dan disubmit.'
                        : 'Silahkan buka tautan untuk mengakses dokumen transparansi penilaian.'}
                </p>
            </div>

            {isTransparencyUnlocked && transparencyUrl ? (
                <a
                    href={transparencyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-purple-500/50 bg-purple-950/30 px-4 font-mono text-xs font-bold tracking-widest text-purple-200 uppercase transition-colors hover:bg-purple-900/40"
                >
                    LIHAT TRANSPARANSI
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            ) : (
                <div className="border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                        <Lock className="h-4 w-4 text-amber-400" />
                        {!transparencyUrl
                            ? 'LINK BELUM TERSEDIA'
                            : isTransparencyUnlocked
                              ? 'MENUNGGU LINK TRANSPARANSI'
                              : 'AKSES TERKUNCI'}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                        {!transparencyUrl
                            ? 'Link transparansi belum tersedia. Silakan hubungi panitia.'
                            : 'Buka tautan kuesioner dan isi serta submit terlebih dahulu untuk membuka akses dokumen transparansi penilaian.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ParticipantCompetitionResultPage() {
    const {
        auth,
        competition,
        team,
        questionnaireUrl,
        transparencyUrl,
        unlockDelaySeconds,
    } = usePage<ResultPageProps>().props;

    const storageKey = `${STORAGE_PREFIX}:${auth.user.id}:${competition.id}`;

    const questionnaireClickedAt = useSyncExternalStore(
        subscribeToClickedAt,
        () => readClickedAt(storageKey),
        () => null, // server snapshot
    );

    const members = team.members ?? [];

    const handleQuestionnaireClick = () => {
        if (!questionnaireUrl) {
            return;
        }

        writeClickedAt(storageKey, Date.now());
        window.open(questionnaireUrl, '_blank', 'noopener,noreferrer');
    };

    const isFinalist = team.is_finalist;

    return (
        <AppLayout>
            <Head title={`Hasil ${competition.name}`} />

            <div className="relative w-full bg-transparent py-6 text-zinc-100 md:py-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6">
                    {/* Page heading: follows the registration page header. */}

                    <div className="flex items-center justify-between border-b border-purple-950/60 pb-4">
                        <div className="font-mono text-xs font-bold tracking-widest text-zinc-500 uppercase">
                            [ PARTICIPANT_PORTAL ]
                        </div>

                        <div className="hidden font-mono text-[10px] tracking-[0.25em] text-purple-400/50 uppercase sm:block">
                            // COMPETITION_RESULT_GATEWAY_V1.0
                        </div>
                    </div>

                    <div className="space-y-2 pb-2 text-center">
                        <h1 className="font-avalors text-2xl font-black tracking-wider text-white uppercase md:text-3xl">
                            Competition Result
                        </h1>

                        <p className="text-sm text-zinc-400">
                            Informasi peserta dan akses transparansi hasil
                            kompetisi.
                        </p>
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        {/* Main column: team information */}

                        <div className="space-y-6">
                            <section className="border border-purple-950/60 bg-black/20 p-5 md:p-6">
                                <div className="mb-5 flex items-center justify-between gap-3 border-b border-purple-950/60 pb-4">
                                    <div>
                                        <p className="mb-1 font-mono text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">
                                            // TEAM_INFORMATION
                                        </p>

                                        <h2 className="text-lg font-bold text-white">
                                            Informasi Tim
                                        </h2>
                                    </div>

                                    <Users className="h-5 w-5 text-purple-400/70" />
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <p className="mb-1 text-xs text-zinc-500">
                                            Nama Tim
                                        </p>

                                        <h3 className="text-xl font-bold text-white md:text-2xl">
                                            {team.team_name || '-'}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Trophy className="h-3.5 w-3.5 text-purple-400" />

                                                {competition.name}
                                            </span>

                                            {team.institution && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Building2 className="h-3.5 w-3.5 text-zinc-500" />

                                                    {team.institution}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-800 pt-5">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <h3 className="font-mono text-xs font-bold tracking-widest text-purple-300 uppercase">
                                                Ketua Tim
                                            </h3>

                                            <span className="font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                                                Team Leader
                                            </span>
                                        </div>

                                        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                                            <div>
                                                <p className="mb-1 text-xs text-zinc-500">
                                                    Nama Lengkap
                                                </p>

                                                <p className="text-sm font-medium text-zinc-200">
                                                    {team.leader_name || '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-1 text-xs text-zinc-500">
                                                    Email
                                                </p>

                                                <p className="flex min-w-0 items-center gap-2 text-sm text-zinc-300">
                                                    <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-500" />

                                                    <span className="break-all">
                                                        {team.leader.email ||
                                                            '-'}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-1 text-xs text-zinc-500">
                                                    Nomor Telepon
                                                </p>

                                                <p className="flex items-center gap-2 text-sm text-zinc-300">
                                                    <Phone className="h-3.5 w-3.5 text-zinc-500" />

                                                    {team.phone_number || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-800 pt-5">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <h3 className="font-mono text-xs font-bold tracking-widest text-purple-300 uppercase">
                                                Anggota Tim
                                            </h3>

                                            <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                                                {members.length} Anggota
                                            </span>
                                        </div>

                                        {members.length > 0 ? (
                                            <div className="divide-y divide-zinc-800 border-y border-zinc-800">
                                                {members.map(
                                                    (member, index) => (
                                                        <div
                                                            key={`${member.member_name}-${index}`}
                                                            className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_auto]"
                                                        >
                                                            <span className="font-mono text-xs text-zinc-600">
                                                                {String(
                                                                    index + 1,
                                                                ).padStart(
                                                                    2,

                                                                    '0',
                                                                )}
                                                            </span>

                                                            <span className="min-w-0 text-sm font-medium text-zinc-200">
                                                                {member.member_name ||
                                                                    '-'}
                                                            </span>

                                                            {member.member_phone_number && (
                                                                <span className="col-start-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 sm:col-start-auto">
                                                                    <Phone className="h-3 w-3" />

                                                                    {
                                                                        member.member_phone_number
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="border-y border-zinc-800 py-4 text-sm text-zinc-500">
                                                Tidak ada anggota tambahan yang
                                                terdaftar.
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-5">
                                        <div>
                                            <p className="mb-1 text-xs text-zinc-500">
                                                Total Peserta
                                            </p>

                                            <p className="text-sm font-semibold text-zinc-200">
                                                {members.length + 1} Orang
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs text-zinc-500">
                                                Status Registrasi
                                            </p>

                                            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Terdaftar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Side column: two-stage result access. */}

                        <aside className="space-y-4 lg:sticky lg:top-6">
                            <section className="border border-purple-950/60 bg-black/20 p-5 md:p-6">
                                <div className="mb-5 border-b border-purple-950/60 pb-4">
                                    <p className="mb-1 font-mono text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">
                                        // RESULT_ACCESS
                                    </p>

                                    <h2 className="text-lg font-bold text-white">
                                        Akses Transparansi Nilai
                                    </h2>

                                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                                        Ikuti tahapan berikut untuk membuka
                                        dokumen transparansi penilaian.
                                    </p>
                                </div>

                                <div className="space-y-0">
                                    {/* Step 01 */}
                                    {!isFinalist && (
                                        <div className="relative pb-7 pl-10">
                                            <div className="absolute top-0 left-0 flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/50 bg-purple-500/10 font-mono text-xs font-bold text-purple-300">
                                                01
                                            </div>

                                            <div className="absolute top-7 bottom-0 left-3.25 border-l border-dashed border-purple-900/70" />

                                            <div className="pb-4">
                                                <h3 className="text-sm font-semibold text-zinc-100">
                                                    Kuesioner Peserta
                                                </h3>

                                                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                                    Buka tautan dan isi
                                                    kuesioner evaluasi kompetisi
                                                    untuk membuka akses dokumen
                                                    transparansi penilaian.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleQuestionnaireClick
                                                }
                                                disabled={!questionnaireUrl}
                                                className="group relative inline-flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-lg px-4 font-mono text-xs font-bold tracking-widest text-purple-100 uppercase transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',

                                                    boxShadow:
                                                        '0 0 20px rgba(177,59,255,0.2)',
                                                }}
                                            >
                                                <span className="relative z-10 inline-flex items-center gap-2">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    BUKA KUESIONER
                                                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </span>

                                                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                            </button>

                                            {!questionnaireUrl && (
                                                <p className="mt-2 text-xs text-rose-400">
                                                    Link kuesioner belum
                                                    tersedia. Silakan hubungi
                                                    panitia.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <TransparencyAccess
                                        clickedAt={questionnaireClickedAt}
                                        unlockDelaySeconds={unlockDelaySeconds}
                                        transparencyUrl={transparencyUrl}
                                        requiresQuestionnaire={!isFinalist}
                                    />

                                    <div className="mt-6 border-t border-purple-950/60 pt-4">
                                        <p className="text-[11px] leading-relaxed text-zinc-500">
                                            Jika mengalami kendala dalam
                                            mengakses dokumen transparansi,
                                            silahkan hubungi panitia melalui
                                            kontak{' '}
                                            <a
                                                href="https://inception.himatifaupnvjt.org/contact"
                                                className="font-bold text-purple-400"
                                            >
                                                disini
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
