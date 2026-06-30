import { Head } from '@inertiajs/react';
import {
    Trophy,
    ClipboardList,
    ChevronRight,
    CircleCheck,
    Clock,
    AlertCircle,
} from 'lucide-react';
import SettingLayout from '@/layouts/setting-layout';

type Competition = {
    id: string;
    name: string;
    role: string;
    status: 'ongoing' | 'upcoming' | 'completed';
    progress: number; // 0-100
};

type Assignment = {
    id: string;
    title: string;
    competition: string;
    dueDate: string;
    status: 'pending' | 'in_review' | 'done';
};

const COMPETITIONS: Competition[] = [
    {
        id: 'c1',
        name: 'Southeast Asia Robotics Cup',
        role: 'Team Lead',
        status: 'ongoing',
        progress: 65,
    },
];

const ASSIGNMENTS: Assignment[] = [
    {
        id: 'a1',
        title: 'Submit prototype design document',
        competition: 'Southeast Asia Robotics Cup',
        dueDate: 'Jul 3',
        status: 'pending',
    },
    {
        id: 'a2',
        title: 'Upload team roster',
        competition: 'Southeast Asia Robotics Cup',
        dueDate: 'Jun 30',
        status: 'in_review',
    },
];

const COMPETITION_STATUS_LABEL: Record<Competition['status'], string> = {
    ongoing: 'Ongoing',
    upcoming: 'Upcoming',
    completed: 'Completed',
};

const COMPETITION_STATUS_STYLE: Record<Competition['status'], string> = {
    ongoing: 'text-purple-300 bg-purple-950/40 border-purple-500/30',
    upcoming: 'text-amber-400 bg-amber-950/20 border-amber-500/30',
    completed: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30',
};

const ASSIGNMENT_STATUS_ICON: Record<Assignment['status'], typeof Clock> = {
    pending: AlertCircle,
    in_review: Clock,
    done: CircleCheck,
};

const ASSIGNMENT_STATUS_STYLE: Record<Assignment['status'], string> = {
    pending: 'text-amber-400',
    in_review: 'text-purple-300',
    done: 'text-emerald-400',
};

const ASSIGNMENT_STATUS_LABEL: Record<Assignment['status'], string> = {
    pending: 'Pending',
    in_review: 'In review',
    done: 'Done',
};

export default function Dashboard() {
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
                    {COMPETITIONS.map((comp) => (
                        <div
                            key={comp.id}
                            className="group flex items-center justify-between gap-4 rounded-lg border border-purple-900/30 bg-[#0d071a]/60 px-4 py-3 transition-colors hover:border-purple-500/40"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-medium text-zinc-200">
                                        {comp.name}
                                    </p>
                                    <span
                                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${COMPETITION_STATUS_STYLE[comp.status]}`}
                                    >
                                        {COMPETITION_STATUS_LABEL[comp.status]}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {comp.role}
                                </p>
                                {comp.status !== 'completed' && (
                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-purple-950/50">
                                        <div
                                            className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500"
                                            style={{
                                                width: `${comp.progress}%`,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-purple-400" />
                        </div>
                    ))}
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
                    {ASSIGNMENTS.map((task) => {
                        const StatusIcon = ASSIGNMENT_STATUS_ICON[task.status];

                        return (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 rounded-lg border border-purple-900/30 bg-[#0d071a]/60 px-4 py-3"
                            >
                                <StatusIcon
                                    className={`h-4 w-4 shrink-0 ${ASSIGNMENT_STATUS_STYLE[task.status]}`}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-zinc-200">
                                        {task.title}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                                        {task.competition}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p
                                        className={`text-xs font-medium ${ASSIGNMENT_STATUS_STYLE[task.status]}`}
                                    >
                                        {ASSIGNMENT_STATUS_LABEL[task.status]}
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
