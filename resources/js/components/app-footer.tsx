import { Link } from '@inertiajs/react';
import { Mail, Phone } from 'lucide-react';
import capitalize from '@/helpers/capitalize';
import competitions from '@/routes/guest/competitions';
import InstagramIcon from './svg/instagram-icon';

const footerCompetitions = [
    {
        label: 'Hackathon',
        href: competitions.show('hackathon').url,
    },
    {
        label: 'Business Plan',
        href: competitions.show('business-plan').url,
    },
    {
        label: 'UI/UX',
        href: competitions.show('ui-ux').url,
    },
    {
        label: 'Data Science',
        href: competitions.show('data-science').url,
    },
    // {
    //     label: 'Essay',
    // },
];

const footerExplore = [
    {
        label: 'About Us',
        href: '/#about',
    },
    {
        label: 'List of Competitions',
        href: '/#competitions',
    },
    {
        label: 'Timelines',
        href: '/#timelines',
    },
    {
        label: 'FAQ',
        href: '/#faq',
    },
    {
        label: 'Contact',
        href: '/contact',
    },
];

export function AppFooter() {
    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-[#020617]">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />

            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6 sm:col-span-2 md:col-span-1 lg:col-span-6">
                        <div>
                            <img
                                src="/assets/png/logo-footer.png"
                                alt="Inception Logo"
                                className="h-10"
                            />
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                                Wadah kompetisi teknologi informasi nasional
                                oleh HIMATIFA UPN "Veteran" Jawa Timur yang
                                memberdayakan generasi muda untuk berinovasi
                                melalui kreativitas dan teknologi.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold tracking-wider text-white">
                                Presented by
                            </span>
                            <div className="flex items-center gap-4">
                                <img
                                    src="/assets/png/UPN.png"
                                    className="h-8"
                                />
                                <img
                                    src="/assets/png/HIMATIFA.png"
                                    className="h-8"
                                />
                                <img
                                    src="/assets/png/KABINET.png"
                                    className="h-8"
                                />
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
                                {footerCompetitions.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="transition hover:text-purple-400"
                                        >
                                            {capitalize(item.label)}
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
                                        <a
                                            href={item.href}
                                            className="transition hover:text-purple-400"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
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
                                        href="mailto:inceptions.upnjatim@gmail.com"
                                        className="break-all transition hover:text-purple-400"
                                    >
                                        inceptions.upnjatim@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone
                                        size={14}
                                        className="text-slate-500"
                                    />
                                    <a
                                        href="https://wa.me/6281288795418"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="transition hover:text-purple-400"
                                    >
                                        +62 812-8879-5418
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <InstagramIcon
                                        size={14}
                                        className="text-slate-500"
                                    />
                                    <a
                                        href="https://www.instagram.com/inception.upnvjt"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="transition hover:text-purple-400"
                                    >
                                        @inception.upnvjt
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
                            href="/privacy-policy"
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
