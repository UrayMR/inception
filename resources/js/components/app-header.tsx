import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { home, logout, register } from '@/routes';
import competitions from '@/routes/guest/competitions';
import panel from '@/routes/panel';
import type { NavItem } from '@/types';
import { AvatarProfile } from './avatar-profile';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/#home',
    },
    {
        title: 'Competitions',
        href: competitions.index.url(),
    },
    {
        title: 'Contact',
        href: '/contact',
    },
];

const mobileAuthNavItems: NavItem[] = mainNavItems.concat([
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Sign Out',
        href: logout.url(),
    },
]);

const mobileNonAuthNavItems: NavItem[] = mainNavItems.concat([
    {
        title: 'Sign Up',
        href: register.url(),
    },
]);

export function AppHeader() {
    const page = usePage();
    const auth = page.props.auth ?? {};
    const { isCurrentUrl } = useCurrentUrl();
    const [mobileOpen, setMobileOpen] = useState(false);

    const mobileNavItems = auth.user
        ? mobileAuthNavItems
        : mobileNonAuthNavItems;

    return (
        <>
            <div
                className="sticky top-0 z-50 w-full px-2 pt-2"
                style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    // background:
                    //     'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(5,0,36,0.6) 60%, rgba(0,0,0,0) 100%)',
                    borderColor: 'rgba(55,0,92,0.5)',
                }}
            >
                <div className="relative mx-auto flex h-16 w-full items-center justify-between px-4 md:max-w-7xl">
                    {/* Logo */}
                    <Link
                        href={home()}
                        prefetch
                        className="flex items-center justify-start space-x-2"
                        style={{
                            filter: 'drop-shadow(0 0 6px rgba(177,59,255,0.4))',
                        }}
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Mode */}
                    <div className="h-full items-center justify-end">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-10">
                                {mainNavItems.map((item, index) => {
                                    const active = isCurrentUrl(item.href);

                                    return (
                                        <NavigationMenuItem
                                            key={index}
                                            className="relative hidden h-full items-center lg:flex"
                                        >
                                            <Link
                                                prefetch
                                                href={item.href as string}
                                                className="relative flex h-9 cursor-pointer items-center rounded-md px-3 text-sm font-medium tracking-wide transition-all duration-200"
                                                style={{
                                                    color: active
                                                        ? '#FFEF5F'
                                                        : '#c4a8e8',
                                                    background: active
                                                        ? 'rgba(177,59,255,0.18)'
                                                        : 'transparent',
                                                    textShadow: active
                                                        ? '0 0 12px rgba(255,239,95,0.5)'
                                                        : 'none',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!active) {
                                                        e.currentTarget.style.color =
                                                            '#B13BFF';
                                                        e.currentTarget.style.background =
                                                            'rgba(177,59,255,0.10)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!active) {
                                                        e.currentTarget.style.color =
                                                            '#c4a8e8';
                                                        e.currentTarget.style.background =
                                                            'transparent';
                                                    }
                                                }}
                                            >
                                                {item.icon && (
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                )}
                                                {item.title}
                                            </Link>

                                            {active && (
                                                <div
                                                    className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px"
                                                    style={{
                                                        background: '#FFEF5F',
                                                        boxShadow:
                                                            '0 0 8px 2px rgba(255,239,95,0.6)',
                                                    }}
                                                />
                                            )}
                                        </NavigationMenuItem>
                                    );
                                })}

                                <NavigationMenuItem className="relative hidden h-full items-center lg:flex">
                                    {auth.user ? (
                                        <AvatarProfile auth={auth} />
                                    ) : (
                                        <Link
                                            href={register()}
                                            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg px-5 text-sm font-medium tracking-wide transition-all duration-300"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                                color: '#F3E8FF',
                                                boxShadow:
                                                    '0 0 20px rgba(177,59,255,0.35)',
                                            }}
                                        >
                                            <span className="relative z-10">
                                                Sign Up
                                            </span>

                                            {/* Shine effect */}
                                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        </Link>
                                    )}
                                </NavigationMenuItem>

                                {/* Mobile Hamburger */}
                                <NavigationMenuItem className="relative flex h-full items-center lg:hidden">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-md transition-all duration-200"
                                        style={{
                                            color: '#c4a8e8',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setMobileOpen(true)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background =
                                                'rgba(177,59,255,0.15)';
                                            e.currentTarget.style.color =
                                                '#B13BFF';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background =
                                                'transparent';
                                            e.currentTarget.style.color =
                                                '#c4a8e8';
                                        }}
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className="fixed inset-0 z-100 flex flex-col gap-5 lg:hidden"
                style={{
                    background: '#050024',
                    // slide in from left
                    transform: mobileOpen
                        ? 'translateX(0)'
                        : 'translateX(-100%)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    // subtle nebula background
                    backgroundImage:
                        'radial-gradient(ellipse at 20% 0%, rgba(55,0,92,0.7) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(177,59,255,0.12) 0%, transparent 50%)',
                }}
                aria-hidden={!mobileOpen}
            >
                <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                        borderBottom: '1px solid rgba(55,0,92,0.5)',
                    }}
                >
                    <Link
                        href={panel.dashboard()}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center space-x-2"
                        style={{
                            filter: 'drop-shadow(0 0 6px rgba(177,59,255,0.4))',
                        }}
                    >
                        <AppLogo className="h-10" />
                    </Link>

                    <Button
                        onClick={() => setMobileOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200"
                        style={{
                            color: '#c4a8e8',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                'rgba(177,59,255,0.15)';
                            e.currentTarget.style.color = '#B13BFF';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#c4a8e8';
                        }}
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col" aria-label="Mobile navigation">
                    {mobileNavItems.map((item, index) => {
                        const active = isCurrentUrl(item.href);

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center px-6 transition-all duration-200"
                                style={{
                                    height: '72px',
                                    borderBottom: active
                                        ? '2px solid rgba(255,239,95,0.6)'
                                        : '1px solid rgba(55,0,92,0.35)',
                                    color: active ? '#FFEF5F' : '#c4a8e8',
                                    fontSize: '22px',
                                    fontWeight: 500,
                                    letterSpacing: '0.01em',
                                    textShadow: active
                                        ? '0 0 16px rgba(255,239,95,0.4)'
                                        : 'none',
                                    // staggered slide-in
                                    transitionDelay: mobileOpen
                                        ? `${index * 60}ms`
                                        : '0ms',
                                    opacity: mobileOpen ? 1 : 0,
                                    transform: mobileOpen
                                        ? 'translateX(0)'
                                        : 'translateX(-16px)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.borderBottomColor =
                                            'rgba(177,59,255,0.5)';
                                        e.currentTarget.style.color = '#B13BFF';
                                    }

                                    e.currentTarget.style.paddingLeft = '28px';
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.borderBottomColor =
                                            'rgba(55,0,92,0.35)';
                                        e.currentTarget.style.color = '#c4a8e8';
                                    }

                                    e.currentTarget.style.paddingLeft = '24px';
                                }}
                            >
                                {item.icon && (
                                    <item.icon className="mr-3 h-5 w-5 opacity-60" />
                                )}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Backdrop - overlay mobile menu */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-99 lg:hidden"
                    style={{ background: 'rgba(0,0,0,0.4)' }}
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
