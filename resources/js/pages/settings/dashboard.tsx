import { Head, Link, usePage } from '@inertiajs/react';
import { Trophy, ClipboardList, ChevronRight } from 'lucide-react';
import SettingLayout from '@/layouts/setting-layout';
import type { ICompetitionIndex, ITransactionIndex } from '@/types';

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

export default function Dashboard() {
    const { competition, transaction } = usePage<{
        competition: ICompetitionIndex;
        transaction: ITransactionIndex;
    }>().props;

    return (
        <SettingLayout>
            <Head title="Dashboard" />

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
                    <Link
                        href={`/competitions/${competition.slug}`}
                        key={competition.id}
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
        </SettingLayout>
    );
}
