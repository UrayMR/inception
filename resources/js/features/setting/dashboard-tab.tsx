import { Link } from '@inertiajs/react';
import { Trophy, ChevronRight, ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { AssignmentStatusMap, TransactionStatusMap } from '@/types';
import type {
    ICompetitionIndex,
    ITransactionIndex,
    IAssignmentShow,
} from '@/types';
import AssignmentItem from './components/assignment-item';

export type TransactionProps = ITransactionIndex & {
    created_at: string;
};

export type AssignmentProps = IAssignmentShow & {
    due_at: string;
    submission: {
        id: number;
        submission_link: string;
        updated_at: string;
        created_at: string;
    } | null;
};

type DashboardTabProps = {
    competition: ICompetitionIndex | null;
    transaction: TransactionProps | null;
    assignments: AssignmentProps[] | null;
};

export default function DashboardTab({
    competition,
    transaction,
    assignments,
}: DashboardTabProps) {
    const [now, setNow] = useState(() => new Date());

    const hasCompetition = Boolean(competition);
    const hasAssignments = Array.isArray(assignments) && assignments.length > 0;
    const isAssignmentActive = assignments?.some(
        (assignment) => assignment.status === AssignmentStatusMap.Active.value,
    );

    const isVerifyTransaction =
        transaction?.status === TransactionStatusMap.verified.value;

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <>
            {/* Competitions */}
            <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between border-b border-purple-950/60 pb-3">
                    <div>
                        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-200">
                            <Trophy className="h-4 w-4 text-purple-400" />
                            Competitions
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            Competitions you're currently part of.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {hasCompetition && competition && transaction ? (
                        <Link
                            href={`/settings?tab=transaction-detail&id=${transaction.id}`}
                            only={['tab', 'transactionDetail']}
                            preserveState
                            preserveScroll
                            replace
                            viewTransition
                            className="group flex items-center justify-between gap-4 rounded-lg border border-purple-900/30 bg-[#0d071a]/60 px-4 py-3 transition-colors hover:border-purple-500/40"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-medium text-zinc-200">
                                        {competition.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 uppercase">
                                        {transaction.status}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-purple-400" />
                        </Link>
                    ) : (
                        <div className="rounded-lg border border-dashed border-purple-900/30 bg-[#0d071a]/40 px-4 py-5 text-center">
                            <p className="text-sm font-medium text-zinc-200">
                                Kamu belum mengikuti kompetisi apa pun.
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Daftar kompetisi untuk melihat detail, status
                                pembayaran, dan agenda.
                            </p>
                            <Link
                                href="/competitions"
                                className="mt-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-300 transition-colors hover:border-purple-400/50 hover:bg-purple-500/15 hover:text-purple-200"
                            >
                                Lihat kompetisi
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Assignments */}
            <div className="rounded-xl border border-purple-500/20 bg-black/30 p-6 backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between border-b border-purple-950/60 pb-3">
                    <div>
                        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-200">
                            <ClipboardList className="h-4 w-4 text-purple-400" />
                            Assignments
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            Tasks that need your attention.
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    {hasAssignments && hasCompetition ? (
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2"
                        >
                            {assignments.map((assignment, index) => (
                                <AssignmentItem
                                    key={assignment.id}
                                    assignment={assignment}
                                    index={index}
                                    now={now}
                                    disabled={
                                        !isVerifyTransaction ||
                                        !isAssignmentActive
                                    }
                                />
                            ))}
                        </Accordion>
                    ) : hasCompetition ? (
                        <div className="rounded-lg border border-dashed border-purple-900/30 bg-[#0d071a]/40 px-4 py-5 text-center">
                            <p className="text-sm font-medium text-zinc-200">
                                Kamu belum memiliki tugas apa pun.
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Tugas akan muncul di sini ketika ada yang perlu
                                kamu kerjakan.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-purple-900/30 bg-[#0d071a]/40 px-4 py-5 text-center">
                            <p className="text-sm font-medium text-zinc-200">
                                Kamu tidak memiliki kompetisi atau tugas apa
                                pun.
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Daftar kompetisi untuk melihat detail, status
                                pembayaran, dan agenda.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
