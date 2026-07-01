import { Link } from '@inertiajs/react';

export default function CTAButton({
    href,
    isActive,
    noMargin = false,
    children,
}: {
    href: string;
    isActive: boolean;
    noMargin?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex w-full justify-center text-center">
            {isActive ? (
                <Link
                    href={href}
                    className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-black tracking-[0.35em] text-purple-400 uppercase transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                >
                    {!noMargin && (
                        <span className="text-lg text-purple-600 transition-all duration-300 group-hover:mr-2 group-hover:text-purple-400">
                            [
                        </span>
                    )}

                    <span className="relative px-3 transition-transform duration-300 group-hover:scale-105">
                        {children ?? 'LAUNCH_MISSION'}
                        <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-linear-to-r from-transparent via-purple-400 to-transparent transition-all duration-300 group-hover:w-full" />
                    </span>

                    {!noMargin && (
                        <span className="text-lg text-purple-600 transition-all duration-300 group-hover:ml-2 group-hover:text-purple-400">
                            ]
                        </span>
                    )}
                </Link>
            ) : (
                <div className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-black tracking-[0.35em] text-zinc-600/60 uppercase select-none">
                    {!noMargin && (
                        <span className="text-lg tracking-normal text-zinc-800">
                            [
                        </span>
                    )}

                    <span className="relative flex items-center gap-2 px-3 text-zinc-600/80">
                        {children ?? 'LOCKED_MISSION'}
                    </span>

                    {!noMargin && (
                        <span className="text-lg tracking-normal text-zinc-800">
                            ]
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
