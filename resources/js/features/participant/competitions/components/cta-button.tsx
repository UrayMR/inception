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
        <div className="flex w-full min-w-0 justify-center text-center">
            {isActive ? (
                <Link
                    href={href}
                    className="group relative inline-flex w-full min-w-0 items-center justify-center px-4 py-2.5 text-xs font-black tracking-widest text-purple-400 uppercase transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.35em]"
                >
                    {!noMargin && (
                        <span className="shrink-0 text-base text-purple-600 transition-all duration-300 select-none group-hover:mr-1 group-hover:text-purple-400 sm:text-lg sm:group-hover:mr-2">
                            [
                        </span>
                    )}

                    <span className="relative max-w-full truncate px-1.5 transition-transform duration-300 group-hover:scale-105 sm:px-3">
                        {children ?? 'LAUNCH_MISSION'}
                        <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-linear-to-r from-transparent via-purple-400 to-transparent transition-all duration-300 group-hover:w-full" />
                    </span>

                    {!noMargin && (
                        <span className="shrink-0 text-base text-purple-600 transition-all duration-300 select-none group-hover:ml-1 group-hover:text-purple-400 sm:text-lg sm:group-hover:ml-2">
                            ]
                        </span>
                    )}
                </Link>
            ) : (
                <div className="relative inline-flex w-full min-w-0 items-center justify-center px-4 py-2.5 text-xs font-black tracking-widest text-zinc-600/60 uppercase select-none sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.35em]">
                    {!noMargin && (
                        <span className="shrink-0 text-base tracking-normal text-zinc-800 sm:text-lg">
                            [
                        </span>
                    )}

                    <span className="relative flex max-w-full items-center justify-center gap-2 truncate px-1.5 text-zinc-600/80 sm:px-3">
                        {children ?? 'LOCKED_MISSION'}
                    </span>

                    {!noMargin && (
                        <span className="shrink-0 text-base tracking-normal text-zinc-800 sm:text-lg">
                            ]
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
