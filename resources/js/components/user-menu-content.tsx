import { Link, router } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { dashboard } from '@/routes/panel';
import { UserRoleMap } from '@/types';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const isAdmin = user.role === UserRoleMap.Admin.value;

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-3 py-2.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-purple-500/20" />

            <DropdownMenuGroup className="space-y-1">
                <DropdownMenuItem
                    asChild
                    className="rounded-lg transition-colors duration-200 focus:bg-purple-900/40 focus:text-white data-highlighted:bg-purple-900/40 data-highlighted:text-white"
                >
                    <Link
                        className="flex w-full cursor-pointer items-center px-2 py-2 font-sans text-xs font-medium tracking-wide text-zinc-300"
                        href={isAdmin ? dashboard() : '/settings?tab=dashboard'}
                        prefetch
                        onClick={cleanup}
                    >
                        <LayoutDashboard className="mr-2.5 h-4 w-4 text-purple-400" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className="rounded-lg transition-colors duration-200 focus:bg-purple-900/40 focus:text-white data-highlighted:bg-purple-900/40 data-highlighted:text-white"
                >
                    <Link
                        className="flex w-full cursor-pointer items-center px-2 py-2 font-sans text-xs font-medium tracking-wide text-zinc-300"
                        href="/settings"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2.5 h-4 w-4 text-purple-400" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-purple-500/20" />

            <DropdownMenuItem
                asChild
                className="group rounded-lg transition-colors duration-200 focus:bg-red-950/40 focus:text-red-400 data-highlighted:bg-red-950/40 data-highlighted:text-red-400"
            >
                <Link
                    className="flex w-full cursor-pointer items-center px-2 py-2 font-sans text-xs font-medium tracking-wide text-zinc-300"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2.5 h-4 w-4 text-purple-400 transition-colors group-hover:text-red-400" />
                    <span>Log out</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
