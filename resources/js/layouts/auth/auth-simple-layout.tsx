import { AppContent } from '@/components/app-content';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader />
            <AppContent variant="header">
                <div className="relative flex min-h-[90vh] flex-col items-center justify-center gap-6 p-6 text-white md:p-10">
                    <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
                    <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium">
                                        {title}
                                    </h1>
                                    <p className="text-center text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </AppContent>
            <AppFooter />
        </AppShell>
    );
}
