import { Link, usePage } from '@inertiajs/react';
import { Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';
import capitalize from '@/helpers/capitalize';
import { show } from '@/routes/guest/competitions';
import type { ICompetitionCard } from '@/types';
import AppLogo from './app-logo';

const footerExplore = [
    {
        label: 'About Us',
        href: '#about',
    },
    {
        label: 'List of Competitions',
        href: '#competitions',
    },
    {
        label: 'Timelines',
        href: '#timeline',
    },
    {
        label: 'FAQ',
        href: '#faq',
    },
    {
        label: 'Contact',
        href: '/contact',
    },
];

export function AppFooter() {
    const { competitions } = usePage<{
        competitions: {
            data: ICompetitionCard[];
        };
    }>().props;

    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-[#020617]">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />

            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6 sm:col-span-2 md:col-span-1 lg:col-span-6">
                        <div>
                            <AppLogo />
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                                Platform kompetisi digital untuk eksplorasi
                                event, komunitas, dan pengalaman baru yang
                                profesional.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold tracking-wider text-white">
                                Presented by
                            </span>
                            <div className="flex items-center gap-4">
                                <AppLogo className="h-10 grayscale" />
                                <AppLogo className="h-10 grayscale" />
                                <AppLogo className="h-10 grayscale" />
                            </div>
                        </div>
                    </div>

                    {/* Center Column */}
                    <div className="grid gap-8 lg:col-span-4 lg:grid-cols-2">
                        {/* Events */}
                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Competitions
                            </h4>

                            <ul className="mt-4 space-y-3 text-sm text-slate-400">
                                {competitions.data.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={show(item.slug)}
                                            className="transition hover:text-purple-400"
                                        >
                                            {capitalize(item.name)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Explore */}
                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Explore
                            </h4>

                            <ul className="mt-4 space-y-3 text-sm text-slate-400">
                                {footerExplore.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="transition hover:text-purple-400"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        {/* Social Media */}
                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Social Media
                            </h4>
                            <div className="mt-4 flex items-center gap-4 text-slate-400">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:text-purple-400"
                                >
                                    <Instagram size={20} />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:text-purple-400"
                                >
                                    <Linkedin size={20} />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:text-purple-400"
                                >
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                CONTACT US
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Mail
                                        size={14}
                                        className="text-slate-500"
                                    />
                                    <a
                                        href="mailto:inception@example.com"
                                        className="break-all transition hover:text-purple-400"
                                    >
                                        inception@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone
                                        size={14}
                                        className="text-slate-500"
                                    />
                                    <a
                                        href="https://wa.me/6285717791441"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="transition hover:text-purple-400"
                                    >
                                        +62 857-1779-1441
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* End Footer */}
                <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-8 text-xs text-slate-500">
                    <div>
                        &copy; {new Date().getFullYear()} Inception. All rights
                        reserved.
                    </div>

                    <div>
                        <Link
                            href="/policy"
                            className="transition hover:text-purple-400"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
