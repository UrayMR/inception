import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderArchive,
    FolderGit2,
    Group,
    House,
    LayoutGrid,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import panel from '@/routes/panel';
import competitions from '@/routes/panel/competitions';
import teams from '@/routes/panel/teams';
import transactions from '@/routes/panel/transactions';
import users from '@/routes/panel/users';
import { UserRoleMap } from '@/types';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: panel.dashboard(),
        icon: LayoutGrid,
        roles: [UserRoleMap.Admin.value, UserRoleMap.Accountant.value],
    },
    {
        title: 'Users',
        href: users.index(),
        icon: Users,
        roles: [UserRoleMap.Admin.value],
    },
    {
        title: 'Competitions',
        href: competitions.index(),
        icon: BookOpen,
        roles: [UserRoleMap.Admin.value],
    },
    {
        title: 'Teams',
        href: teams.index(),
        icon: Group,
        roles: [UserRoleMap.Admin.value],
    },
    {
        title: 'Transactions',
        href: transactions.index(),
        icon: FolderArchive,
        roles: [UserRoleMap.Admin.value, UserRoleMap.Accountant.value],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: home(),
        icon: House,
    },
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const user = usePage().props.auth.user;

    const filteredMainNav = user?.role
        ? mainNavItems.filter((item) => item.roles?.includes(user?.role))
        : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={panel.dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNav} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
