import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { User, LayoutDashboard, Lock } from 'lucide-react';

type NavItem = {
    label: string;
    tab: string;
    icon: LucideIcon;
    disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { label: 'Profile', tab: 'profile', icon: User, disabled: true },
    { label: 'Security', tab: 'security', icon: Lock, disabled: true },
];

export default function SettingSidebar({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    const { tab } = usePage<{ tab: string }>().props;

    const getInitial = (value: string) =>
        value ? value.substring(0, 2).toUpperCase() : 'U';

    return (
        <aside className="space-y-6 lg:col-span-3">
            <div className="flex flex-col items-center rounded-xl border border-purple-500/20 bg-black/30 p-6 text-center backdrop-blur-md">
                <div className="group relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-linear-to-b from-purple-500 to-pink-500 opacity-40 blur-md transition-opacity duration-500 group-hover:opacity-70"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-500 bg-[#120824] shadow-inner">
                        <span className="bg-linear-to-r from-purple-400 via-fuchsia-200 to-white bg-clip-text font-mono text-xl font-black tracking-tighter text-transparent">
                            {getInitial(name)}
                        </span>
                    </div>
                </div>

                <h3 className="w-full max-w-45 truncate text-base font-semibold text-zinc-200">
                    {name}
                </h3>
                <p className="mt-1 w-full max-w-45 truncate font-mono text-xs text-purple-400/70">
                    {email}
                </p>

                <nav className="mt-6 w-full space-y-1.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive = tab === item.tab;
                        const Icon = item.icon;
                        const isDisabled = item.disabled;

                        return (
                            <Link
                                key={item.tab}
                                href={
                                    isDisabled
                                        ? '#'
                                        : `/settings?tab=${item.tab}`
                                }
                                only={[
                                    'tab',
                                    'competition',
                                    'schedule',
                                    'transaction',
                                ]}
                                preserveState
                                preserveScroll
                                replace
                                className={
                                    isDisabled
                                        ? 'flex cursor-not-allowed items-center gap-3 px-3 py-2 text-sm text-zinc-600/50'
                                        : isActive
                                          ? 'flex items-center gap-3 rounded-lg border border-purple-500/30 bg-linear-to-r from-purple-950/40 to-transparent px-3 py-2 text-sm text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                          : 'flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-400 transition-all duration-200 hover:border-purple-900/30 hover:bg-purple-950/20 hover:text-purple-300'
                                }
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
