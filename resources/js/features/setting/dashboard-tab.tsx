import { Link } from '@inertiajs/react';
import { Trophy, ChevronRight, ClipboardList } from 'lucide-react';
import type { ICompetitionIndex, TransactionStatusType } from '@/types';

export type TransactionProps = {
    id: string;
    team_name: string;
    competition_name: string;
    amount: number;
    status: TransactionStatusType;
    created_at: string;
};

type DashboardTabProps = {
    competition: ICompetitionIndex | null;
    transaction: TransactionProps | null;
};

type Assignment = {
    id: string;
    title: string;
    competition: string;
    dueDate: string;
    status: 'pending' | 'in_review' | 'done';
};

const assignments: Assignment[] = [
    {
        id: 'a1',
        title: 'Submit prototype design document',
        competition: 'UI/UX',
        dueDate: 'Jul 3',
        status: 'pending',
    },
];

export default function DashboardTab({
    competition,
    transaction,
}: DashboardTabProps) {
    const hasCompetition = Boolean(competition);

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
                                Daftar kompetisi dulu untuk melihat detail,
                                status pembayaran, dan agenda.
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

                <div className="space-y-2">
                    {assignments.map((task) => {
                        return (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 rounded-lg border border-purple-900/30 bg-[#0d071a]/60 px-4 py-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-zinc-200">
                                        {task.title}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                                        {task.competition}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-xs font-medium text-zinc-400 uppercase">
                                        {task.status}
                                    </p>
                                    <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
                                        Due {task.dueDate}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
