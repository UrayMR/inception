import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import ScheduleCalendar from '@/pages/settings/components/schedule-calendar';
import SettingSidebar from '@/pages/settings/components/setting-sidebar';
import type { Auth, BreadcrumbItem, CompetitionTimeline } from '@/types';

export default function SettingLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { auth, schedule } = usePage<{
        auth: Auth;
        schedule: CompetitionTimeline[];
    }>().props;

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <div className="relative w-full bg-transparent py-6 text-zinc-100 md:py-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6">
                    <div className="flex items-center justify-between border-b border-purple-950/60 pb-4">
                        <Link
                            href={'/settings'}
                            className="group inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wide text-zinc-500 transition-colors hover:text-purple-400"
                        >
                            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            <span>Back</span>
                        </Link>

                        <div className="hidden font-mono text-[10px] tracking-[0.2em] text-purple-400/40 uppercase sm:block">
                            // SETTING
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <SettingSidebar
                            name={auth.user.name}
                            email={auth.user.email}
                        />

                        <div className="space-y-6 lg:col-span-6">
                            {children}
                        </div>

                        <ScheduleCalendar entries={schedule} />
                    </div>
                </div>
            </div>
        </AppLayoutTemplate>
    );
}
