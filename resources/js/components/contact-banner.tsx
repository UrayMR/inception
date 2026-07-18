import type { LucideIcon } from 'lucide-react';
import { Mail } from 'lucide-react';
import InstagramIcon from './svg/instagram-icon';
import WhatsappIcon from './svg/whatsapp-icon';
import { Icon } from './ui/icon';

export default function ContactBanner({
    contacts,
}: {
    contacts?: {
        icon: LucideIcon;
        label: string;
        value: string;
        href: string;
    }[];
}) {
    const contactsMap = contacts ?? [
        {
            icon: Mail,
            label: 'Email',
            value: 'inception@gmail.com',
            href: 'mailto:inception@gmail.com',
        },
        {
            icon: WhatsappIcon as unknown as LucideIcon,
            label: 'WhatsApp',
            value: '+62 811-3491-880',
            href: 'https://wa.me/628113491880',
        },
        {
            icon: InstagramIcon as unknown as LucideIcon,
            label: 'Instagram',
            value: '@inception',
            href: 'https://instagram.com/inception',
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-950/40 p-8 backdrop-blur-md md:p-12">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

            {/* corner brackets, konsisten dengan aksen di komponen lain */}
            <div className="pointer-events-none absolute top-0 left-0 h-10 w-10 rounded-tl-2xl border-t-2 border-l-2 border-purple-500/30" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-10 w-10 rounded-br-2xl border-r-2 border-b-2 border-purple-500/30" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-purple-400 uppercase">
                    // OPEN_CHANNEL
                </span>

                <h2 className="font-sans text-3xl leading-tight font-black tracking-tight text-white uppercase md:text-4xl">
                    How Can We Help You?
                </h2>

                <p className="max-w-md text-sm leading-relaxed text-zinc-400 md:text-base">
                    Have questions? Feel free to reach out to our team!
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                    {contactsMap.map((c) => (
                        <a
                            key={c.label}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/30 px-4 py-2.5 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-950/20"
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full text-purple-400 transition-colors group-hover:text-amber-400">
                                <Icon iconNode={c.icon} className="h-4 w-4" />
                            </span>
                            <span className="font-mono text-xs font-bold tracking-wide text-zinc-200 uppercase transition-colors group-hover:text-white">
                                {c.label}
                                <span className="ml-1 text-zinc-500 normal-case group-hover:text-purple-300">
                                    ({c.value})
                                </span>
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
