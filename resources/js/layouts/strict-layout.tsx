import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { home } from '@/routes';

export default function StrictLayout({
    children,
    title = '',
    description = '',
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AppShell variant="header">
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="relative flex flex-1 flex-col overflow-hidden">
                <div className="absolute top-6 right-6 z-50">
                    <Link
                        href={home()}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-950/30 text-purple-300 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-900/50 hover:text-white active:scale-95"
                    >
                        <X className="h-5 w-5" />
                    </Link>
                </div>

                <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
                    <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
                </div>

                <AppContent variant="header">
                    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-white sm:p-6 md:p-10">
                        <div className="w-full max-w-2xl">
                            <div className="flex flex-col gap-6">
                                {(title || description) && (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="space-y-2 text-center">
                                            {title && (
                                                <h1 className="text-xl font-medium tracking-wide">
                                                    {title}
                                                </h1>
                                            )}
                                            {description && (
                                                <p className="text-center text-sm text-purple-200/60">
                                                    {description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {children}
                            </div>
                        </div>
                    </div>
                </AppContent>
            </div>
        </AppShell>
    );
}
