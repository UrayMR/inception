import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const CONTACTS = [
    {
        label: 'WhatsApp',
        value: '+62 811-3491-880',
        href: 'https://wa.me/628113491880',
        cta: 'Chat on WhatsApp',
        code: 'CH_01',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7C17.18 3.03 14.7 2 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.27-4.36c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.2 8.21zm4.51-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.5-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.57c.13.16 1.75 2.68 4.25 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        value: 'inception@gmail.com',
        href: 'mailto:inception@gmail.com',
        cta: 'Send an Email',
        code: 'CH_02',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-7 w-7"
            >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6 8.5 7 8.5-7" />
            </svg>
        ),
    },
    {
        label: 'Instagram',
        value: '@inception',
        href: 'https://instagram.com/inception',
        cta: 'Visit Instagram',
        code: 'CH_03',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-7 w-7"
            >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                    cx="17.2"
                    cy="6.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        ),
    },
];

export default function Contact() {
    return (
        <AppLayout>
            <Head title="Contact" />

            <main className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden p-6 text-white md:px-12">
                <div className="relative z-10 mx-auto max-w-7xl w-full">
                    {/* header */}
                    <div className="mb-16 text-center">
                        <span className="mb-4 block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                            // OPEN_CHANNEL
                        </span>
                        <h1 className="mx-auto max-w-3xl text-4xl leading-widest font-avalors font-black tracking-widest text-white uppercase md:text-6xl">
                            GET IN TOUCH
                        </h1>
                        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-amber-400" />
                        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-purple-200/60">
                            Any questions, collaboration, or other inquiries?
                            Contact us via any of the channels below.
                        </p>
                    </div>

                    {/* contact cards */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {CONTACTS.map((c) => (
                            <a
                                key={c.label}
                                href={c.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-purple-900/40 bg-[#0d0829]/80 p-8 shadow-[0_30px_70px_rgba(5,2,15,0.8)] backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-950/30"
                            >
                                <div className="pointer-events-none absolute top-0 left-0 h-10 w-10 rounded-tl-3xl border-t-2 border-l-2 border-purple-500/30" />
                                <div className="pointer-events-none absolute right-0 bottom-0 h-10 w-10 rounded-br-3xl border-r-2 border-b-2 border-purple-500/30" />

                                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-purple-500 uppercase">
                                    {c.code}
                                </span>

                                <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-800/50 bg-purple-950/40 text-amber-400 transition-all duration-300 group-hover:border-purple-500/50 group-hover:text-amber-300">
                                    {c.icon}
                                </div>

                                <h3 className="mt-6 text-lg font-avalors font-bold tracking-widest text-white uppercase">
                                    {c.label}
                                </h3>
                                <p className="mt-2 text-sm text-purple-200/70">
                                    {c.value}
                                </p>

                                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-purple-300 uppercase transition-colors duration-300 group-hover:text-amber-400">
                                    {c.cta}
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
