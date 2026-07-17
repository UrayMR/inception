import { useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronRight,
    Link2,
    PenIcon,
    XIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import formatDate from '@/helpers/format-date';
import type { AssignmentProps } from '../dashboard-tab';
import { submission } from '@/routes/settings/assignments';

interface AssignmentItemProps {
    assignment: AssignmentProps;
    index: number;
    now: Date;
}

export default function AssignmentItem({
    assignment,
    index,
    now,
}: AssignmentItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const dueDate = new Date(assignment.due_at);
    const isPastDue = now.getTime() > dueDate.getTime();
    const hasSubmission = assignment.submission !== null;

    const { data, setData, post, processing, errors } = useForm({
        assignment_id: assignment.id,
        submission_link: assignment.submission?.submission_link ?? '',
    });

    const countDownDueAt = () => {
        const timeDiff = dueDate.getTime() - now.getTime();

        if (timeDiff <= 0) {
            return '00:00:00';
        }

        const totalSeconds = Math.floor(timeDiff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formatPart = (value: number) => String(value).padStart(2, '0');

        return `${formatPart(hours)}:${formatPart(minutes)}:${formatPart(seconds)}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isPastDue) {
            return;
        }

        post(submission.url(assignment.id), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <AccordionItem
            value={assignment.id.toString()}
            className="group rounded-lg border border-purple-900/30 bg-[#0d071a]/60 px-4 transition-all hover:bg-[#120a24]/50 data-[state=open]:bg-[#120a24]/80"
        >
            <AccordionTrigger className="flex cursor-pointer items-center gap-4 py-4 text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <div className="w-6 shrink-0 font-mono text-xs font-semibold text-purple-400">
                    {String(index + 1).padStart(2, '0')}
                </div>

                <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate text-sm font-medium text-zinc-200">
                        {assignment.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {assignment.competition.label}
                    </p>
                </div>

                <div className="mr-2 shrink-0">
                    <span className="rounded border border-purple-900/40 bg-purple-950/40 px-2 py-1 font-mono text-[10px] text-purple-300">
                        Due {formatDate(assignment.due_at, { long: true })}
                    </span>
                </div>
            </AccordionTrigger>

            <AccordionContent className="mt-1 border-t border-purple-950/50 pt-3 pb-5">
                <div className="space-y-4">
                    {assignment.assignment_guide_link && (
                        <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-800/50 bg-zinc-900/40 p-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-200">
                                        Dokumen Panduan Pengerjaan
                                    </p>
                                    <p className="truncate text-[11px] text-zinc-500">
                                        Lihat instruksi lengkap pengerjaan
                                        disini
                                    </p>
                                </div>
                            </div>
                            <a
                                href={assignment.assignment_guide_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-purple-400 transition-colors hover:text-purple-300"
                            >
                                Buka Panduan
                                <ChevronRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    )}

                    {!hasSubmission || isEditing ? (
                        <div className="space-y-3 rounded-md p-3">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <Link2 className="h-4 w-4 shrink-0 text-purple-400" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-zinc-200">
                                            {isEditing
                                                ? 'Ubah Link Pengumpulan'
                                                : 'Link Pengumpulan Tugas'}
                                        </p>
                                        <p
                                            className={`truncate text-[11px] ${isPastDue ? 'text-red-400' : 'text-zinc-500'}`}
                                        >
                                            {isPastDue
                                                ? 'Waktu pengumpulan telah berakhir'
                                                : `Sisa waktu: ${countDownDueAt()}`}
                                        </p>
                                    </div>
                                </div>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setData(
                                                'submission_link',
                                                assignment.submission
                                                    ?.submission_link ?? '',
                                            );
                                        }}
                                        aria-label="Batal edit link"
                                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
                                    >
                                        <XIcon className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-1.5"
                            >
                                <div className="relative flex rounded-md shadow-sm">
                                    <input
                                        type="url"
                                        name="submission_link"
                                        id={`submission-${assignment.id}`}
                                        placeholder="https://..."
                                        value={data.submission_link}
                                        onChange={(e) =>
                                            setData(
                                                'submission_link',
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing || isPastDue}
                                        className="block w-full min-w-0 rounded-l-md border border-purple-900/40 bg-[#07030e] px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || isPastDue}
                                        className="relative -ml-px inline-flex items-center gap-1 rounded-r-md border border-purple-800 bg-purple-900/40 px-4 py-2 text-xs font-semibold text-purple-200 transition-all hover:bg-purple-900/60 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim'}
                                    </button>
                                </div>

                                {errors.submission_link && (
                                    <p className="text-xs text-red-400">
                                        {errors.submission_link}
                                    </p>
                                )}

                                <p className="text-xs text-zinc-500">
                                    Link dapat berupa Google Drive, GitHub, atau
                                    platform lain yang relevan.
                                </p>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-3 rounded-md p-3">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-zinc-200">
                                            Tugas sudah dikumpulkan
                                        </p>
                                        <p className="truncate text-[11px] text-zinc-500">
                                            Terkirim pada{' '}
                                            {formatDate(
                                                assignment.submission
                                                    ?.created_at,
                                                { long: true },
                                            ) ?? '-'}
                                        </p>
                                    </div>
                                </div>

                                {!isPastDue && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        aria-label="Edit link pengumpulan"
                                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
                                    >
                                        <PenIcon className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {assignment.submission?.submission_link && (
                                <a
                                    href={assignment.submission.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 transition-colors hover:text-purple-300"
                                >
                                    Lihat link pengumpulan
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
